## Created Using [cli/create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

```bash
$ npx create-next-app@latest <project-name> --ts --eslint --tailwind --src-dir --use-bun --app --turbopack
- alias? NO (press enter)
```
Turbopack: [For faster local development](https://nextjs.org/docs/architecture/turbopack)

---
## Getting Started

Installation: **[For better performance you can use "Bun"](https://bun.sh/)**

```bash
$ bun i
# or
$ npm i
# or
$ yarn i
# or
$ pnpm i
```

Run the development server:

```bash
$ bun dev
# or
$ bun run dev
# or
$ npm run dev
# or
$ yarn dev
# or
$ pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---
## Tree Structure
layout.tsx -> DrawerWrapper.component.tsx -> MiniDrawer.component.tsx

## Folder Structure

- src/
    - app/ **( routes )**
        - <route-name-OR-page-name>/
            - components/ **( The Components of the current page )**
                - Layout.tsx **( The Layout of the current page )**
                - ...
            - page.tsx **( will be added as a new route )**
        - ...
        - favicon.ico **( Project Logo )**
        - globals.css **( for all the project )**
        - layout.tsx **( layout start page )**
        - not-found.tsx **( 404 page )**
        - page.tsx **( root page )**
    - assets/ **( Project Assets )**
        - fonts/
        - images/
        - svgs/
        - ...
    - shared/
        - components/ **( shared/global components )**
        - css/ **( shared CSS )**
        - constants/ **( shared constants )**
        - services/
        - utils/
        - ...
    - features/
        - <feature-name>/
            - apis/
            - hooks/
            - types/
            - interfaces/
            - ...
    - config/ **( Project Configurations )**
    - **'lib/', 'components/', 'components.json'** **( from 'shadcn' package )**


## Notes:
- Files started with "-" are not used but we can use it later, for example: "-DockerfileBUN" OR "-favicon.ico"
