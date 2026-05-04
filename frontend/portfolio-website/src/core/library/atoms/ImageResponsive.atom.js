import { base } from '@/styles/atoms/imageResponsive.module.scss';

const IMAGE_BASE_URL = 'https://paulserban.eu/assets/images';

const ACCEPTED_FORMATS = ['avif', 'webp'];
const FALLBACK_FORMAT = 'png';
const IMAGE_EXTENSION_REGEX = /\.(avif|webp|jpe?g|png|gif|svg)$/i;


/**
 * The ImageResponsive component generates responsive image URLs based on the provided src, aspect ratios, and widths.
 * It uses the <picture> element to serve different image formats (AVIF, WebP) and falls back to PNG if necessary.
 * 
 * Matrix:
 * | Aspect Ratios           | 0 = 1x1          | 1 = 4x3          | 2 = 16x9          | 3 = 21x9           | 4 = 3x4            |
 * | Responsive Widths       | 0 = 480px        | 1 = 960px        | 2 = 1280px        | 3 = 1920px         | 4 = 2560px         |
 * | Responsive Breakpoints  | xs               | sm               | md                | lg                 | xl                 |
 * | Resulting Image Example | hero-480_480.png | hero-960_720.png | hero-1280_720.png | hero-1920_1080.png | hero-2560_1440.png |
 * 
 * Example
 */
const ASPECT_RATIOS = ['1x1', '4x3', '16x9', '21x9', '3x4'];
const RESPONSIVE_WIDTHS = [480, 960, 1280, 1920, 2560];
const RESPONSIVE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl'];


const ASPECT_RATIO_DIMENSIONS = {
    '1x1': {
        480: [480, 480],
        960: [960, 960],
        1280: [1280, 1280],
        1920: [1920, 1920],
        2560: [2560, 2560],
    },
    '4x3': {
        480: [480, 360],
        960: [960, 720],
        1280: [1280, 960],
        1920: [1920, 1440],
        2560: [2560, 1920],
    },
    '16x9': {
        480: [480, 270],
        960: [960, 540],
        1280: [1280, 720],
        1920: [1920, 1080],
        2560: [2560, 1440],
    },
    '21x9': {
        480: [480, 228],
        960: [960, 456],
        1280: [1280, 608],
        1920: [1920, 912],
        2560: [2560, 1216],
    },
    '3x4': {
        480: [360, 480],
        960: [720, 960],
        1280: [960, 1280],
        1920: [1440, 1920],
        2560: [1920, 2560],
    },
};

const stripExtension = (value = '') => {
    const [pathWithoutQuery] = String(value).split(/[?#]/);

    return pathWithoutQuery.replace(IMAGE_EXTENSION_REGEX, '');
};

const normalizeImagePath = (value) => {
    const trimmed = stripExtension(value).replace(/^\/+/, '');

    return trimmed.replace(/^images\//, '');
};

const normalizeIndexes = (value, fallback) => {
    if (Array.isArray(value) && value.length === 5) {
        return value;
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed) && parsed.length === 5) {
                return parsed;
            }
        } catch {
            return fallback;
        }
    }

    return fallback;
};

const toImageUrl = (imagePath, ratio, width, format) => {
    const [fileWidth, fileHeight] = ASPECT_RATIO_DIMENSIONS[ratio][width];

    return `${IMAGE_BASE_URL}/${imagePath}-${fileWidth}_${fileHeight}.${format}`;
};

const buildSrcSetEntries = (imagePath, ratioIndexes, widthIndexes, format) => {
    return RESPONSIVE_KEYS.map((sizeKey, index) => {
        const ratio = ASPECT_RATIOS[ratioIndexes[index]];
        const width = RESPONSIVE_WIDTHS[widthIndexes[index]];

        return {
            sizeKey,
            width,
            src: toImageUrl(imagePath, ratio, width, format),
            srcset: `${toImageUrl(imagePath, ratio, width, format)} ${width}w`,
        };
    });
};

const createSrcSet = (imagePath, ratioIndexes, widthIndexes, format) => {
    return buildSrcSetEntries(imagePath, ratioIndexes, widthIndexes, format)
        .map((entry) => entry.srcset)
        .join(', ');
};

/**
 * Usage example:
 * <ImageResponsive src="images/hero-banner.jpg" alt="Developer workspace" />ASPECT_RATIO_DIMENSIONS
 * <ImageResponsive
 *   src="/images/hero-banner"
 *   alt="Developer workspace"
 *   ratiosStr="[2,2,2,2,2]"
 *   widthsStr="[0,1,2,3,4]"
 * />
 *
 * Both examples resolve to responsive files like:
 * hero-banner-480_270.avif, hero-banner-960_540.webp, hero-banner-1280_720.png
 */
const ImageResponsive = ({ src, alt, ratiosStr = '[2,2,2,2,2]', widthsStr = '[0,1,2,3,4]' }) => {
    const imagePath = normalizeImagePath(src);
    const ratioIndexes = normalizeIndexes(ratiosStr, [2, 2, 2, 2, 2]);
    const widthIndexes = normalizeIndexes(widthsStr, [0, 1, 2, 3, 4]);
    const fallbackEntry = buildSrcSetEntries(imagePath, ratioIndexes, widthIndexes, FALLBACK_FORMAT)[0];

    if (!imagePath) {
        return null;
    }

    return (
        <div className={base}>
            <picture>
                {ACCEPTED_FORMATS.map((format) => (
                    <source
                        key={format}
                        type={`image/${format}`}
                        srcSet={createSrcSet(imagePath, ratioIndexes, widthIndexes, format)}
                        sizes="(max-width: 768px) 100vw, 66vw"
                    />
                ))}
                <img
                    src={fallbackEntry.src}
                    srcSet={createSrcSet(imagePath, ratioIndexes, widthIndexes, FALLBACK_FORMAT)}
                    sizes="(max-width: 768px) 100vw, 66vw"
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                />
            </picture>
        </div>
    );
};

export default ImageResponsive;