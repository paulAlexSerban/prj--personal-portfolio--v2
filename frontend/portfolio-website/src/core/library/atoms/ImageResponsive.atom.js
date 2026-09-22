import { base } from '@/styles/atoms/imageResponsive.module.scss';

const IMAGE_BASE_URL = 'https://paulserban.eu/assets/images';

const ACCEPTED_FORMATS = ['avif', 'webp'];
const FALLBACK_FORMAT = 'png';
const DEFAULT_QUALITY = 80;
const IMAGE_EXTENSION_REGEX = /\.(avif|webp|jpe?g|png|gif|svg)$/i;

/**
 * Aspect ratio / width matrix (same contract as content--paulserban.eu assets & v3 ImageResponsive):
 * | Aspect Ratios           | 0 = 1x1   | 1 = 4x3   | 2 = 16x9  | 3 = 21x9  | 4 = 3x4   |
 * | Responsive Widths       | 0 = 480px | 1 = 960px | 2 = 1280px| 3 = 1920px| 4 = 2560px|
 * | Responsive Breakpoints  | xs        | sm        | md        | lg        | xl        |
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

const DEFAULT_RATIO_INDEXES = [2, 2, 2, 2, 2];
const DEFAULT_WIDTH_INDEXES = [0, 1, 2, 3, 4];
const DEFAULT_SIZES = '(max-width: 768px) 100vw, 66vw';

const stripExtension = (value = '') => {
    const [pathWithoutQuery] = String(value).split(/[?#]/);
    return pathWithoutQuery.replace(IMAGE_EXTENSION_REGEX, '');
};

const normalizeImageName = (value = '') => {
    const slug = stripExtension(value)
        .replace(/^\/+/, '')
        .replace(/^images\//, '')
        .split('/')
        .filter(Boolean)
        .pop();

    return slug || '';
};

const normalizeHash = (value = '') => {
    return String(value)
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 8)
        .toLowerCase();
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
            return [...fallback];
        }
    }

    return [...fallback];
};

const toImageUrl = (imageName, hash, ratio, width, format) => {
    const [fileWidth, fileHeight] = ASPECT_RATIO_DIMENSIONS[ratio][width];
    const filename = `${imageName}-${fileWidth}x${fileHeight}-${ratio}-q${DEFAULT_QUALITY}.${hash}.${format}`;
    return `${IMAGE_BASE_URL}/${filename}`;
};

const buildSrcSetEntries = (imageName, hash, ratioIndexes, widthIndexes, format) => {
    return RESPONSIVE_KEYS.map((sizeKey, index) => {
        const ratio = ASPECT_RATIOS[ratioIndexes[index]];
        const width = RESPONSIVE_WIDTHS[widthIndexes[index]];
        const src = toImageUrl(imageName, hash, ratio, width, format);

        return {
            sizeKey,
            width,
            src,
            srcset: `${src} ${width}w`,
        };
    });
};

const createSrcSet = (imageName, hash, ratioIndexes, widthIndexes, format) => {
    return buildSrcSetEntries(imageName, hash, ratioIndexes, widthIndexes, format)
        .map((entry) => entry.srcset)
        .join(', ');
};

/**
 * Responsive <picture> for content MDX (same asset naming contract as v3 / content pipeline).
 *
 * @example
 * <ImageResponsive
 *   imageName="hero-banner"
 *   alt="Developer workspace"
 *   ratiosStr="[2,2,2,2,2]"
 *   widthsStr="[0,1,2,3,4]"
 *   hash="a3f91c2b"
 * />
 */
const ImageResponsive = ({
    imageName,
    alt,
    ratiosStr = '[2,2,2,2,2]',
    widthsStr = '[0,1,2,3,4]',
    hash,
    sizes = DEFAULT_SIZES,
    className = '',
    imgClassName = '',
    loading = 'lazy',
}) => {
    const normalizedImageName = normalizeImageName(imageName);
    const normalizedHash = normalizeHash(hash);
    const ratioIndexes = normalizeIndexes(ratiosStr, DEFAULT_RATIO_INDEXES);
    const widthIndexes = normalizeIndexes(widthsStr, DEFAULT_WIDTH_INDEXES);
    const fallbackEntry = buildSrcSetEntries(
        normalizedImageName,
        normalizedHash,
        ratioIndexes,
        widthIndexes,
        FALLBACK_FORMAT
    )[0];

    if (!normalizedImageName || !normalizedHash) {
        return null;
    }

    return (
        <div className={`${base} ${className}`.trim()}>
            <picture>
                {ACCEPTED_FORMATS.map((format) => (
                    <source
                        key={format}
                        type={`image/${format}`}
                        srcSet={createSrcSet(
                            normalizedImageName,
                            normalizedHash,
                            ratioIndexes,
                            widthIndexes,
                            format
                        )}
                        sizes={sizes}
                    />
                ))}
                <img
                    src={fallbackEntry.src}
                    srcSet={createSrcSet(
                        normalizedImageName,
                        normalizedHash,
                        ratioIndexes,
                        widthIndexes,
                        FALLBACK_FORMAT
                    )}
                    sizes={sizes}
                    alt={alt}
                    loading={loading}
                    decoding="async"
                    className={imgClassName}
                />
            </picture>
        </div>
    );
};

export default ImageResponsive;
