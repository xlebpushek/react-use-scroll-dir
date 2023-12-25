# React-use-scroll-dir

React use scroll dir - is a library that allows you to control events depending on the scrolling dir of individual components or the main frame of a web application

# Instalation

yarn

```sh
yarn add react-use-scroll-dir
```

npm

```sh
npm install react-use-scroll-dir
```

pnpm

```sh
pnpm install react-use-scroll-dir
```

# Usage

From window

```tsx
// page.tsx
'use client'

import { useScrollDir } from 'react-use-scroll-dir'

export default function RootPage() {
  const {
    lastScrollDir,
    scrollDir,
    isScrolling,
    isScrollingY,
    isScrollingX,
    isScrollingUp,
    isScrollingLeft,
    isScrollingDown,
    isScrollingRight
  } = useScrollDir()

  return <div>
    lastScrollDir: {lastScrollDir}
    scrollDir: {scrollDir}
    isScrolling: {isScrolling}
    isScrollingY: {isScrollingY}
    isScrollingX: {isScrollingX}
    isScrollingUp: {isScrollingUp}
    isScrollingLeft: {isScrollingLeft}
    isScrollingDown: {isScrollingDown}
    isScrollingRight: {isScrollingRight}
  </div>
}
```

From target

```tsx
// page.tsx
'use client'

import { useScrollDir } from 'react-use-scroll-dir'

export default function RootPage() {
  const scrollElement = document.getElementById('scrollElement')

  const { ... } = useScrollDir(scrollElement!)

  return <div ref={scrollElement}>...</div>
}
```

From ref target

```tsx
// page.tsx
'use client'

import { useRef } from 'react'
import { useScrollDir } from 'react-use-scroll-dir'

export default function RootPage() {
  const scrollElementRef = useRef<HTMLDivElement | null>(null)
  const { ... } = useScrollDir(ref.current!)

  ...
}
```

# License

Copyright (c) Xlebp Rjanoi (xlebpushek). All rights reserved.

Licensed under the [MIT](LICENSE) license.
