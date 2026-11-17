# Azhara Studio: concept site, version 2

This is a full rebuild of the Azhara concept site using azhara.in's real catalogue, images, prices, ratings,
services and policies (captured 17 Nov 2026). It is a **concept demo**: no orders or payments are processed.

## Open it
Double-click `index.html`. It is already built, and the Google Fonts (Jost and Bodoni Moda) need an internet connection.
The 3D film plays on your first visit. Use **"Replay the film"** in the footer to see it again.

## Stack
- **React 19** for all components and pages (`src/`), bundled with esbuild into `dist/app.js`
- **three.js r170** for the 3D film: a procedural Azhara 30 mL dropper bottle with transmission glass, amber oil, a ribbed gold collar,
  RoomEnvironment reflections, soft shadows, caustics, a satin silk backdrop, a 3D wordmark and camera-parented depth-of-field petals
- **GSAP 3.12** for the shot timeline (`src/three/film.js`)
- React Three Fiber couldn't be installed in the build environment (offline). `film.js` is written so it can be wrapped
  in an R3F `<Canvas>` later. The bottle is also exported as `assets/models/azhara-fiorelle-bottle.glb`.

## Rebuild
`npm install && npm run build`, or `./build.sh` if esbuild is on your PATH.

## Structure
```
src/three/film.js       the opening film (6 shots) + live hero stage
src/three/bottle.js     procedural bottle model
src/components/         Film overlay, Chrome (header, full-screen menu, bag drawer, search, quick view, footer), ui primitives
src/pages/              Home, Shop (collections, lines, brands), Product, Discover / Vibe / Brands,
                        Studio (Gifting, Custom, Business, About, Journal), Commerce (Cart, Checkout, Account, Wishlist, Contact, FAQ, Policies)
src/data/               catalogue.js (52 products from products.json), content.js (brand copy, services, FAQ, policies, 40 brands, 4 journal articles)
src/lib/                store (cart, wishlist, validation, search), hash router
assets/img/             285 Azhara images
```

## Honest limits
Checkout, sign-in, the newsletter and the forms are demo only; the brief forms open WhatsApp with the message pre-filled. Prices and ratings are a
snapshot. The brands list holds the first 40 houses published on azhara.in. Shipping below ₹2,000 is shown as an estimate.
