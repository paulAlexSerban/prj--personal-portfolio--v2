import Head from 'next/head';
import dynamic from 'next/dynamic';
import GenericTemplate from '@/core/system/templates/Generic.template';
import useSiteProps from '@/core/hooks/useSiteProps';
const HeroBanner = dynamic(() => import('@/core/library/organisms/HeroBanner.organism'));
const Section = dynamic(() => import('@/core/library/organisms/Section.organism'));
import { Paragraph, Heading } from '@/core/library/atoms/typography';
import List from '@/core/library/atoms/List.atom';
import content from '@/content/dist/pages/cookie_policy.json';
import { PageProvider } from '@/core/context/PageContext';
import usePageProps from '@/core/hooks/usePageProps';
import BaseMeta from '@/core/system/meta/Base.meta';
import OpenGraph from '@/core/system/meta/OpenGraph.meta';

function CookiePolicyPage() {
    const { icons, socialMediaLinks } = useSiteProps();
    const pageContent = usePageProps();

    const { title, main, excerpt, author, tags, robots, type, image, url, site_name, locale, assetsPath } = pageContent;
    const { heroBanner  } = main;
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
                <Section headingTitle={'What Are Cookies'}>
                    <Paragraph>
                        As is common practice with almost all professional websites, this site uses cookies, which are
                        tiny files that are downloaded to your computer to improve your experience. This page describes
                        what information they gather, how we use it, and why we sometimes need to store these cookies.
                        We will also share how you can prevent these cookies from being stored, however, this may
                        downgrade or &apos;break&apos; certain elements of the site&apos;s functionality.
                    </Paragraph>
                </Section>
                <Section headingTitle={'How We Use Cookies'}>
                    <Paragraph>
                        We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are
                        no industry standard options for disabling cookies without completely disabling the
                        functionality and features they add to this site. It is recommended that you leave on all
                        cookies if you are not sure whether you need them or not in case they are used to provide a
                        service that you use.
                    </Paragraph>
                </Section>
                <Section headingTitle={'Types of Cookies We Use'}>
                    <Heading level={3}>Essential Cookies</Heading>
                    <Paragraph>
                        These cookies are essential for the running of our website. Without the use of these cookies,
                        parts of our website wouldn&apos;t function. These cookies do not track any personal information.{' '}
                    </Paragraph>
                    <List
                        items={[
                            'Google reCAPTCHA Cookies: Google reCAPTCHA sets a necessary cookie (_GRECAPTCHA) to enable or disable the captcha challenge. This helps us prevent automated access and spam submissions on our forms.',
                        ]}
                    />
                    <Heading level={3}>Google Analytics Cookies</Heading>
                    <Paragraph>
                        We use Google Analytics to understand how you engage with our website. This service may use a
                        set of cookies to collect information and report website usage statistics without personally
                        identifying individual visitors to Google. The main cookie used by Google Analytics is the _ga
                        cookie.
                    </Paragraph>
                    <Heading level={3}>Marketing Cookies</Heading>
                    <Paragraph>
                        We may also use some cookies that aim to promote products and services that are relevant to you.
                        These cookies are subject to your preferences, which can be updated through our Cookie Settings.
                    </Paragraph>
                </Section>
                <Section headingTitle={'Disabling Cookies'}>
                    <Paragraph>
                        You can prevent the setting of cookies by adjusting the settings on your browser (see your
                        browser Help for how to do this). Be aware that disabling cookies will affect the functionality
                        of this and many other websites that you visit. Disabling cookies will usually result in also
                        disabling certain functionality and features of this site. Therefore it is recommended that you
                        do not disable cookies.
                    </Paragraph>
                    <Paragraph>
                        You cam also adjust your cookie preferences by clicking on the &quot;Cookie Settings&quot; button in in
                        the footer of the website.
                    </Paragraph>
                </Section>
            </GenericTemplate>
        </>
    );
}

export default function Index({ pageContent }) {
    return (
        <PageProvider value={pageContent}>
            <CookiePolicyPage />
        </PageProvider>
    );
}

export async function getStaticProps() {
    return {
        props: {
            pageContent: content,
        },
    };
}
