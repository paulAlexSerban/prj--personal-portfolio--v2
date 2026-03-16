import BaseMeta from '@/core/system/meta/Base.meta';
import OpenGraph from '@/core/system/meta/OpenGraph.meta';
import dynamic from "next/dynamic";
import useSiteProps from "@/core/hooks/useSiteProps";
import { PageProvider } from "@/core/context/PageContext";
import usePageProps from "@/core/hooks/usePageProps";
import content from "@/content/dist/pages/portfolio/coursework/index.json";
import getInstance from '@/core/utils/ContentRepository';

const GenericTemplate = dynamic(() => import("@/core/system/templates/Generic.template.js"));
const HeroBanner = dynamic(() => import("@/core/library/organisms/HeroBanner.organism"));
const Section = dynamic(() => import("@/core/library/organisms/Section.organism"));
const PostsOverview = dynamic(() => import("@/core/library/organisms/PostsOverview.organism"));

function CourseworkPage() {
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
                <Section>
                    <PostsOverview
                        content={main.section__coursework.content[0].children[0].content}
                        showViewAllButton={false}
                    />
                </Section>
            </GenericTemplate>
        </>
    );
}

export default function Portfolio({ pageContent }) {
    return (
        <PageProvider value={pageContent}>
            <CourseworkPage />
        </PageProvider>
    );
}

export async function getStaticProps() {
    const contentRepository = await getInstance();  // Use the `getInstance` function
    const coursework = await contentRepository.sortedContent.coursework;
    const courseworkFrontmatter = coursework.map((coursework) => coursework.content.frontmatter);
    content.main.section__coursework.content[0].children[0].content.list = courseworkFrontmatter;

    const assetsPath = process.env.ASSETS_PATH;
    content.assetsPath = assetsPath;

    return {
        props: {
            pageContent: content,
        },
    };
}
