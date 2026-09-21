import fsPromises from 'fs/promises';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { sanitizeQueryString } from '@/utils/TextUtils';
import rehypeHighlight from 'rehype-highlight';
import rehypeAttr from 'rehype-attr';
import remarkGfm from 'remark-gfm';

const CONTENT_DIRECTORY = './content/dist';
const TYPE_PATTERNS = /^(projects|coursework|posts|booknotes|snippets)$/;
const EXCLUDED_CONTENT_SUBDIRS = new Set(['questions', 'cheat_sheet', 'learning_plan', 'intermediary']);

/**
 * Recursively collect MDX content files.
 * Accepts:
 * - Flat layout (fixtures): {type}/{slug}.mdx when isTypeRoot
 * - Nested layout (live): {YYYY}/{MM}/{slug}/{slug}.mdx (basename matches parent dir)
 * Skips companion folders: questions, cheat_sheet, learning_plan, intermediary
 */
async function collectMdxFiles(dirPath, isTypeRoot) {
    const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });
    const dirName = path.basename(dirPath);
    const files = [];

    for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.mdx')) {
            const slug = entry.name.replace(/\.mdx$/, '');
            if (isTypeRoot || slug === dirName) {
                files.push({ dir: dirPath, filename: entry.name });
            }
        } else if (entry.isDirectory() && !EXCLUDED_CONTENT_SUBDIRS.has(entry.name)) {
            files.push(...(await collectMdxFiles(path.join(dirPath, entry.name), false)));
        }
    }

    return files;
}

class ContentRepository {
    constructor(jsonContentPath = '') {
        if (!ContentRepository.instance) {
            this.contentFiles = [];
            this.parsedContent = {};
            this.jsonContentPath = jsonContentPath;
            ContentRepository.instance = this;
        }
        return ContentRepository.instance;
    }

    async getPageJsonContent(jsonContentPath) {
        return await import(`@/content/dist/pages/${jsonContentPath}index.json`);
    }

    async setupContentFiles() {
        try {
            const contentItems = await fsPromises.readdir(path.resolve(CONTENT_DIRECTORY), { withFileTypes: true });

            const filteredItems = contentItems.filter((item) => item.isDirectory() && TYPE_PATTERNS.test(item.name));

            return await Promise.all(
                filteredItems.map(async (item) => {
                    const itemPath = path.resolve(CONTENT_DIRECTORY, item.name);
                    const entries = await collectMdxFiles(itemPath, true);
                    return {
                        typeName: item.name,
                        entries,
                    };
                })
            );
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async setupParsedContent() {
        const parsedContent = {};
        for (const item of this.contentFiles) {
            const { typeName, entries } = item;
            parsedContent[typeName] = [];

            for (const { dir, filename } of entries) {
                const slug = filename.replace(/\.mdx$/, '');
                const fullPath = path.join(dir, filename);
                const content = await this.getContent(fullPath);
                content.frontmatter.slug = slug;
                parsedContent[typeName].push({
                    slug,
                    path: dir,
                    filename,
                    fullPath,
                    typeName,
                    content,
                });
            }
        }
        return parsedContent;
    }

    async getContent(filePath) {
        try {
            const markdownWithMeta = await fsPromises.readFile(filePath, 'utf-8');

            return await serialize(markdownWithMeta, {
                parseFrontmatter: true,
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeHighlight, rehypeAttr],
                },
            });
        } catch (error) {
            console.error(`Error reading file: ${filePath}`, error);
        }
    }

    async setupTags() {
        const tags = Object.keys(this.parsedContent).reduce((acc, type) => {
            this.parsedContent[type].forEach((item) => {
                const itemTags = item.content.frontmatter.tags;
                if (itemTags && itemTags.length > 0) {
                    itemTags.forEach((tag) => {
                        const sanitizedTag = sanitizeQueryString(tag);
                        acc[sanitizedTag] = tag;
                    });
                }
            });
            return acc; // This line is important
        }, {});

        return Object.keys(tags)
            .sort()
            .reduce((acc, key) => {
                acc[key] = tags[key];
                return acc;
            }, {});
    }

    async setupCategories() {
        return Object.keys(this.parsedContent).reduce((acc, type) => {
            this.parsedContent[type].forEach((item) => {
                const itemCategories = item.content.frontmatter.categories;
                if (itemCategories && itemCategories.length > 0) {
                    itemCategories.forEach((category) => {
                        const sanitizedCategory = sanitizeQueryString(category);
                        if (!acc.includes(sanitizedCategory)) {
                            acc.push(sanitizedCategory);
                        }
                    });
                }
            });
            return acc; // This line is important
        }, []);
    }

    async all() {
        return this.parsedContent;
    }

    async findOne(type, slug) {
        return this.parsedContent[type].find((item) => item.slug === slug);
    }

    async findByType(type) {
        return this.parsedContent[type];
    }

    async findByTag(type, tag) {
        return this.parsedContent[type].filter((item) => {
            const { tags } = item.content.frontmatter;
            return tags.includes(tag);
        });
    }

    async findByCategory(type, category) {
        return this.parsedContent[type].filter((item) => item.content.frontmatter.category === category);
    }

    async findByDate(type, date) {
        return this.parsedContent[type].filter((item) => item.content.frontmatter.date === date);
    }

    async findByStatus(type, status) {
        return this.parsedContent[type].filter((item) => item.content.frontmatter.status === status);
    }

    async findAllBySlug(slug) {
        return Object.keys(this.parsedContent).reduce((acc, type) => {
            const foundContent = this.parsedContent[type].find((item) => item.slug === slug);
            if (foundContent) {
                acc.push(foundContent);
            }
            return acc;
        }, []);
    }

    async setupPublishedContent() {
        return Object.keys(this.parsedContent).reduce((acc, type) => {
            const publishedContent = this.parsedContent[type].filter(
                (item) => item.content.frontmatter.status === 'published'
            );
            acc[type] = publishedContent;
            return acc;
        }, {});
    }

    async allDrafts() {
        return Object.keys(this.parsedContent).reduce((acc, type) => {
            const draftContent = this.parsedContent[type].filter((item) => item.content.frontmatter.status === 'draft');
            acc.push(...draftContent);
            return acc;
        }, []);
    }

    async setupSortedContent(order = 'desc') {
        return Object.keys(this.publishedContent).reduce((acc, type) => {
            const sortedContent = this.publishedContent[type].sort((a, b) => {
                return order === 'asc'
                    ? new Date(a.content.frontmatter.date) - new Date(b.content.frontmatter.date)
                    : new Date(b.content.frontmatter.date) - new Date(a.content.frontmatter.date);
            });
            acc[type] = sortedContent;
            return acc;
        }, {});
    }

    async setupGroupedByDateContent() {
        return Object.keys(this.sortedContent).reduce((acc, type) => {
            const groupedByDateContent = this.sortedContent[type].reduce((acc, item) => {
                const { date } = item.content.frontmatter;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(item.content.frontmatter.slug);
                return acc;
            }, {});
            acc[type] = groupedByDateContent;
            return acc;
        }, {});
    }

    async setupPinnedContent() {
        return Object.keys(this.sortedContent).reduce((acc, type) => {
            const pinnedContent = this.sortedContent[type].filter((item) => item.content.frontmatter.pinned === true);
            acc[type] = pinnedContent;
            return acc;
        }, {});
    }

    async init() {
        this.content = await this.getPageJsonContent(this.jsonContentPath);
        this.contentFiles = await this.setupContentFiles();
        this.parsedContent = await this.setupParsedContent();
        this.tags = await this.setupTags();
        this.categories = await this.setupCategories();
        this.publishedContent = await this.setupPublishedContent();
        this.sortedContent = await this.setupSortedContent();
        this.groupedByDateContent = await this.setupGroupedByDateContent();
        Object.entries(this.groupedByDateContent).forEach(([type, content]) => {
            Object.entries(content).forEach(([date, slugs]) => {
                if (slugs.length > 1) {
                    console.log(`[ ${type} ] ${date} - ${slugs.length} items - ${slugs.join(', ')}`);
                }
            });
        });
        this.pinnedContent = await this.setupPinnedContent();
    }
}

let instance = null;

async function getInstance(jsonContentPath = '') {
    if (!instance) {
        instance = new ContentRepository(jsonContentPath);
        await instance.init();
        Object.freeze(instance);
    }
    return instance;
}

export default getInstance;
