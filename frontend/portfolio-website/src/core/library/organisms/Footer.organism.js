import {
    base,
    container,
    bottom,
    copyrightText,
    domainUrl,
    footerNav,
    linkList,
} from '@/styles/organisms/footer.module.scss';
import { Link } from '@/core/atoms/typography';
import SocialMediaList from '../molecules/SocialMediaList.molecule';
import LinkList from '../molecules/LinkList.molecule';
import useSiteProps from '@/core/hooks/useSiteProps';
import { CookieContext } from '@/context/CookieContext';
import { useContext } from 'react';

const date = new Date();
const currentYear = date.getFullYear();

export default function Footer() {
    const { socialMediaLinks, resume } = useSiteProps();
    const hasSocialMediaLinks = socialMediaLinks.length > 0;
    const { setCookieSettingsVisible } = useContext(CookieContext);

    return (
        <footer className={base}>
            <div className={container}>
                {hasSocialMediaLinks && <SocialMediaList items={socialMediaLinks} position="footer" />}
                <div className={footerNav}>
                    <LinkList
                        links={[
                            // {
                            //     label: resume.label,
                            //     href: resume.url,
                            //     isEncoded: false,
                            //     isInternal: true,
                            //     isDownload: true,
                            // },
                            {
                                label: 'Portfolio',
                                href: '/portfolio',
                                isEncoded: false,
                                isInternal: true,
                            },
                            {
                                label: 'My Projects',
                                href: '/portfolio/project',
                                isEncoded: false,
                                isInternal: true,
                            },
                            {
                                label: 'Coursework',
                                href: '/portfolio/coursework',
                                isEncoded: false,
                                isInternal: true,
                            },
                            // {
                            //     label: "Contact Me",
                            //     href: "/contact-me",
                            //     isEncoded: false,
                            //     isInternal: true,
                            // },
                        ]}
                    />
                    <LinkList
                        links={[
                            {
                                label: 'Blog',
                                href: '/blog',
                                isEncoded: false,
                                isInternal: true,
                            },
                            {
                                label: 'Posts',
                                href: '/blog/post',
                                isEncoded: false,
                                isInternal: true,
                            },
                            {
                                label: 'Snippets',
                                href: '/blog/snippet',
                                isEncoded: false,
                                isInternal: true,
                            },
                            {
                                label: 'Book Notes',
                                href: '/blog/booknote',
                                isEncoded: false,
                                isInternal: true,
                            },
                        ]}
                    />
                    <LinkList
                        links={[
                            {
                                label: 'Cookie Settings',
                                href: '#cookie-settings',
                                isEncoded: false,
                                isInternal: true,
                                handleClick: () => setCookieSettingsVisible(true),
                            },
                            {
                                label: 'Cookie Policy',
                                href: '/cookie_policy',
                                isEncoded: false,
                                isInternal: true,
                            },
                        ]}
                    />
                </div>
            </div>
            <div className={bottom}>
                <span className={copyrightText}>{currentYear} &copy; Paul Serban. All rights reserved.</span>
                <span>
                    <Link className={domainUrl} ariaLabel="www.paulserban.eu" isInternal={true} href="/">
                        www.paulserban.eu
                    </Link>
                    {'  '}|{'  '}
                    <Link className={domainUrl} ariaLabel="Sitemap" isInternal={true} href="/sitemap.xml">
                        Sitemap
                    </Link>
                </span>
            </div>
        </footer>
    );
}
