import BaseMeta from '@/core/system/meta/Base.meta';
import OpenGraph from '@/core/system/meta/OpenGraph.meta';
import useSiteProps from '@/core/hooks/useSiteProps';
import { PageProvider } from '@/core/context/PageContext';
import usePageProps from '@/core/hooks/usePageProps';
import dynamic from 'next/dynamic';
import { Paragraph } from '@/core/library/atoms/typography';
import GenericTemplate from '@/core/system/templates/Generic.template';
import content from '@/content/dist/pages/index.json';
import SkillsShowcase from '@/core/library/organisms/SkillShowcase.organism';
import SkillGallery from '@/core/library/organisms/SkillGallery.organism';
import PostsOverview from '@/core/library/organisms/PostsOverview.organism';
import getInstance from '@/core/utils/ContentRepository';

const HeroBanner = dynamic(() => import('@/core/library/organisms/HeroBanner.organism'));
const Section = dynamic(() => import('@/core/library/organisms/Section.organism'));

function IndexPage() {
    const pageContent = usePageProps();
    const { title, main, excerpt, author, tags, robots, type, image, url, site_name, locale, assetsPath } = pageContent;
    const { heroBanner, section__aboutMe, section__myProjects, section__mySkills, section__whatIDo } = main;
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
                    pageTitle={heroBanner.content[0].pageTitle}
                    subheading={heroBanner.content[1].subheading}
                    socialMediaLinks={socialMediaLinks}
                />
                <Section
                    headingTitle={section__myProjects.content[0].title.main}
                    hasSeparator={true}
                    subheadingText={section__myProjects.content[0].title.sub}
                >
                    <PostsOverview
                        content={section__myProjects.content[1].children[0].content}
                        showViewAllButton={true}
                    />
                </Section>
                <Section headingTitle={section__aboutMe.content[0].title.main} hasSeparator={false}>
                    {section__aboutMe.content[1].children.map((child, index) => (
                        <Paragraph key={index}>{child.content[0].text}</Paragraph>
                    ))}
                </Section>
                <Section headingTitle={section__mySkills.content[0].title.main} hasSeparator={false}>
                    <SkillsShowcase list={section__mySkills.content[1].children[0].content} />
                    <SkillGallery list={section__mySkills.content[1].children[1].content} />
                </Section>
                {section__whatIDo.content[1].children.length !== 0 && (
                    <Section headingTitle={section__whatIDo.content[0].title.main} hasSeparator={false}>
                        {section__whatIDo.content[1].children.map((child, index) => (
                            <Paragraph key={index}>{child.content[0].text}</Paragraph>
                        ))}
                    </Section>
                )}
            </GenericTemplate>
        </>
    );
}

export default function Index({ pageContent }) {
    return (
        <PageProvider value={pageContent}>
            <IndexPage />
        </PageProvider>
    );
}

// Fetch data at build time
export async function getStaticProps() {
    const contentRepository = await getInstance();  // Use the `getInstance` function
    const projects = await contentRepository.pinnedContent.projects;
    const projectsFrontmatter = projects.map((project) => project.content.frontmatter);
    content.main.section__myProjects.content[1].children[0].content.list = projectsFrontmatter.slice(0, 6);
    const assetsPath = process.env.ASSETS_PATH;
    content.assetsPath = assetsPath;
    return {
        props: {
            pageContent: content,
        },
    };
}

