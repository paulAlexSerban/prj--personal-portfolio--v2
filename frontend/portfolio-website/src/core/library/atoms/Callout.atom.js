import { base } from '@/styles/atoms/callout.module.scss';

/**
 * Lightweight MDX callout for content that uses <Callout type="…">.
 * Matches the v3 blog-site Callout contract (type + children).
 */
const Callout = ({ type = 'note', children }) => {
    const safeType = String(type).replace(/[^a-z0-9-]/gi, '');
    return (
        <aside className={base} data-callout-type={safeType}>
            {children}
        </aside>
    );
};

export default Callout;
