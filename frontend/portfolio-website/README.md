# (project): Personal Portfolio (v2)
## (module): Portfolio Website
> (description): This module contains the code for the personal portfolio website

## ImageRenditions component usage

The responsive image component in this module is implemented as `ImageResponsive`.
It builds image URLs that follow the renditions output contract:

`{slug}-{width}x{height}-{ratio}-q{quality}.{hash8}.{format}`

Example:

`mvc-interactions-diagram-1280x720-16x9-q80.a3f91c2b.avif`

### Component import

```js
import ImageResponsive from '@/core/library/atoms/ImageResponsive.atom';
```

### Props

- `imageName` (string, required): image slug (extension/path are tolerated and normalized).
- `alt` (string, required): image alt text.
- `ratiosStr` (stringified array, optional): ratio index per breakpoint.
- `widthsStr` (stringified array, optional): width index per breakpoint.
- `hash` (string, required): 8-char rendition hash (cache-busting token).

Defaults:

- `ratiosStr='[2,2,2,2,2]'` (all `16x9`)
- `widthsStr='[0,1,2,3,4]'` (`480,960,1280,1920,2560`)

### Index mapping

Breakpoints order: `xs`, `sm`, `md`, `lg`, `xl`

Ratio indexes:

- `0 -> 1x1`
- `1 -> 4x3`
- `2 -> 16x9`
- `3 -> 21x9`
- `4 -> 3x4`

Width indexes:

- `0 -> 480`
- `1 -> 960`
- `2 -> 1280`
- `3 -> 1920`
- `4 -> 2560`

### Basic example

```jsx
<ImageResponsive
	imageName="mvc-interactions-diagram"
	alt="Architecture interactions diagram"
	hash="a3f91c2b"
/>
```

This renders AVIF/WebP sources plus PNG fallback with responsive `srcSet` entries.

### Custom ratios and widths

```jsx
<ImageResponsive
	imageName="team-photo"
	alt="Team at the annual meetup"
	ratiosStr="[1,1,2,2,2]"
	widthsStr="[0,1,2,3,4]"
	hash="5f1ece9b"
/>
```

In this case:

- `xs` and `sm` use `4x3`
- `md`, `lg`, and `xl` use `16x9`

### Notes

- Component returns `null` when `imageName` or `hash` is missing/invalid.
- The component currently uses quality `q80` in generated filenames.
- Prefer passing `imageName` exactly as it appears in renditions metadata and the matching `hash` from generated outputs.