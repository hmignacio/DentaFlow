# DentaFlow — React + Express Starter

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Open http://localhost:5173 for the React app. Express runs at http://localhost:5000.

Verify the API: http://localhost:5000/api/health

## Structure
- `client/src/components/Navbar.jsx`: reusable navigation bar
- `client/src/components/Footer.jsx`: reusable footer
- `client/src/pages/Home.jsx`: homepage
- `client/src/pages/Placeholder.jsx`: temporary route pages
- `client/src/App.jsx`: shared layout and React Router routes
- `client/src/styles.css`: responsive styling
- `server/index.js`: Express backend

## Add your existing HTML/CSS pages
1. Create a new `.jsx` file under `client/src/pages/`.
2. Convert `class` to `className`, `for` to `htmlFor`, close self-closing elements, and wrap adjacent JSX elements.
3. Import the page into `App.jsx` and replace its placeholder route.
4. Keep `<Navbar/>` and `<Footer/>` only in `App.jsx`, not inside each page.
5. Move any page-specific CSS into a separate CSS file and import it from the page.

The homepage uses a remotely hosted stock dental image, so internet access is needed to load it. Replace the image URL with a locally stored asset for offline use. The provided screenshot is included only as a visual reference in `client/src/assets/reference.png`; it is not used as a page background.

The API includes only health and empty services endpoints; booking and authentication are not implemented. The Book now button navigates to the login placeholder.
