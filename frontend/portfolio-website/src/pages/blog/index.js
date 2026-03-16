import BaseMeta from '@/core/system/meta/Base.meta';
import OpenGraph from '@/core/system/meta/OpenGraph.meta';
import dynamic from "next/dynamic";
import useSiteProps from "@/core/hooks/useSiteProps";
import { PageProvider } from "@/core/context/PageContext";
import usePageProps from "@/core/hooks/usePageProps";
import content from "@/content/dist/pages/blog/index.json";
import getInstance from '@/core/utils/ContentRepository';

const GenericTemplate = dynamic(() => import("@/core/system/templates/Generic.template.js"));
const HeroBanner = dynamic(() => import("@/core/library/organisms/HeroBanner.organism"));
const Section = dynamic(() => import("@/core/library/organisms/Section.organism"));
const PostsOverview = dynamic(() => import("@/core/library/organisms/PostsOverview.organism"));

function PortfolioPage() {
    const pageContent = usePageProps();
    const { title, excerpt, main, assetsPath, tags, robots, author, image, url, type, site_name, locale } = pageContent;
    const { icons, socialMediaLinks } = useSiteProps();

    return (
        <>
            <BaseMeta
                title={title}
                description={excerpt}
                keywords={tags.join(', ')}
                robots={robots}
                assetsPath={assetsPath}
                author={author}
                favicon={icons.favicon}
            />

            <OpenGraph
                title={title}
                description={excerpt}
                keywords={tags.join(', ')}
                image={image}
                url={url}
                type={type}
                robots={robots}
                assetsPath={assetsPath}
                author={author}
                favicon={icons.favicon}
                siteName={site_name}
                locale={locale}
            />

            <GenericTemplate>
                <HeroBanner
                    pageTitle={main.heroBanner.content[0].pageTitle}
                    subheading={main.heroBanner.content[1].subheading}
                    socialMediaLinks={socialMediaLinks}
                />
                <Section
                    headingTitle={main.section__posts.content[0].title.main}
                    hasSeparator={true}
                    subheadingText={main.section__posts.content[0].title.sub}
                >
                    <PostsOverview
                        content={main.section__posts.content[1].children[0].content}
                        showViewAllButton={true}
                    />
                </Section>
                <Section
                    headingTitle={main.section__booknotes.content[0].title.main}
                    hasSeparator={true}
                    subheadingText={main.section__booknotes.content[0].title.sub}
                >
                    <PostsOverview
                        content={main.section__booknotes.content[1].children[0].content}
                        showViewAllButton={true}
                    />
                </Section>
                <Section
                    headingTitle={main.section__snippets.content[0].title.main}
                    hasSeparator={true}
                    subheadingText={main.section__snippets.content[0].title.sub}
                >
                    <PostsOverview
                        content={main.section__snippets.content[1].children[0].content}
                        showViewAllButton={true}
                    />
                </Section>
            </GenericTemplate>
        </>
    );
}

export default function Portfolio({ pageContent }) {
    return (
        <PageProvider value={pageContent}>
            <PortfolioPage />
        </PageProvider>
    );
}

export async function getStaticProps() {
    const contentRepository = await getInstance();  // Use the `getInstance` function

    const posts = await contentRepository.pinnedContent.posts;
    const booknotes = await contentRepository.pinnedContent.booknotes;
    const snippets = await contentRepository.pinnedContent.snippets;

    const postsFrontmatter = posts.map((post) => post.content.frontmatter);
    const booknotesFrontmatter = booknotes.map((booknote) => booknote.content.frontmatter);
    const snippetsFrontmatter = snippets.map((snippet) => snippet.content.frontmatter);

    content.main.section__posts.content[1].children[0].content.list = postsFrontmatter.slice(0, 6);
    content.main.section__booknotes.content[1].children[0].content.list = booknotesFrontmatter.slice(0, 6);
    content.main.section__snippets.content[1].children[0].content.list = snippetsFrontmatter.slice(0, 6);

    const assetsPath = process.env.ASSETS_PATH;
    content.assetsPath = assetsPath;

    return {
        props: {
            pageContent: content,
        },
    };
}
