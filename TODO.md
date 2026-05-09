# URL Restructure & SEO Enhancement Plan

## URL Restructure

- [x] Move all `.md` files from `content/blogs/` to `content/` root
- [x] Delete empty `content/blogs/` directory
- [x] Verify routes auto-update in `lib/content.ts`

## SEO Enhancements

- [ ] Update `app/layout.tsx` with base Open Graph, Twitter Card, canonical URL
- [ ] Update `app/writings/[...slug]/page.tsx` with rich metadata (OG, Twitter, JSON-LD Article schema, cover image)
- [ ] Update `app/writings/page.tsx` with archive-level SEO metadata
- [ ] Update `app/about/page.tsx` with SEO metadata
- [ ] Build and verify no errors
