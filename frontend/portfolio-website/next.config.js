const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        // If you use remark-gfm, you'll need to use next.config.mjs
        // as the package is ESM only
        // https://github.com/remarkjs/remark-gfm#install
        remarkPlugins: [],
        rehypePlugins: [],
        // If you use `MDXProvider`, uncomment the following line.
        // providerImportSource: "@mdx-js/react",
    },
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetPrefix = basePath || undefined;

/** @type {import('next').NextConfig} */


const nextConfig = {
    // Configure pageExtensions to include md and mdx
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    // Optionally, add any other Next.js config below
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        dirs: ['.'],
    },
    output: 'export',
    basePath,
    assetPrefix,
    // Optional: Add a trailing slash to all paths `/about` -> `/about/`
    // It is needed for AWS S3 static hosting to support clean URLs (instead of example.com/about.html it will be example.com/about/)
    // IDEA POST: How to fix AWS S3 static hosting to support clean URLs (instead of example.com/about.html it will be example.com/about/)
    trailingSlash: true,
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
    experimental: {
        scrollRestoration: true,
    },
    images: {
        unoptimized: true,
    }
};

// Merge MDX config with Next.js config
module.exports = withMDX(nextConfig);
