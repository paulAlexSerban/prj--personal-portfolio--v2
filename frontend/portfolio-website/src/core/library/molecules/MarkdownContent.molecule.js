import { useId } from "react";
import { base } from "@/styles/molecules/markdownContainer.module.scss";
import { MDXRemote } from "next-mdx-remote";
import { Paragraph, Heading, Link } from "@/core/atoms/typography";
import LinkList from "@/core/library/molecules/LinkList.molecule";
import ImageSvg from "@/core/library/atoms/ImageSvg.atom";
import ImageResponsive from "@/core/library/atoms/ImageResponsive.atom";
import Callout from "@/core/library/atoms/Callout.atom";

export default function MarkdownContainer({ markdownContent, articleId }) {
    const ID = useId();
    const components = {
        p: (props) => <Paragraph {...props} />,
        h2: (props) => <Heading level={2} {...props} />,
        h3: (props) => <Heading level={3} {...props} />,
        h4: (props) => <Heading level={4} {...props} />,
        Paragraph,
        Heading,
        Link,
        LinkList,
        ImageSvg,
        ImageResponsive,
        Callout,
    };

    return (
        <>
            {markdownContent && (
                <article id={articleId || ID} className={base}>
                    <MDXRemote compiledSource={markdownContent} components={components} />
                </article>
            )}
        </>
    );
}
