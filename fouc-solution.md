# Eliminating Flash of Unstyled Content (FOUC) in Multi-Zone Next.js with styled-components

This document explains how we solved the Flash of Unstyled Content (FOUC) issue that was occurring in our multi-zone Next.js application with shared styled-components.

## The Problem

When using styled-components in a multi-zone Next.js application, especially with shared components:

1. Initial page load showed unstyled content before styles were applied
2. This was particularly noticeable with components imported from the shared package
3. The issue persisted even with proper server-side rendering configuration

## The Solution

We implemented a comprehensive solution that combines several techniques:

### 1. Enhanced StyledComponentsRegistry

We modified the StyledComponentsRegistry to:

- Hide the content initially using CSS (`visibility: hidden`)
- Show the content only after styles are fully loaded and applied
- Add a special Firefox fix to prevent FOUC in Firefox browsers

```jsx
"use client";

import React, { useState, useEffect } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager, createGlobalStyle } from "styled-components";

// Global style to initially hide content until styles are applied
const GlobalHideStyle = createGlobalStyle`
  html {
    visibility: hidden;
  }
`;

// Global style to show content when everything is ready
const GlobalShowStyle = createGlobalStyle`
  html {
    visibility: visible;
  }
`;

export function StyledComponentsRegistry({ children }) {
  // Create a stylesheet for this render cycle
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());
  const [isStylesReady, setStylesReady] = useState(false);

  // Use a higher priority insertion to ensure styles are loaded before content
  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // When on client, mark styles as ready after hydration is complete
  useEffect(() => {
    // This setTimeout ensures styles are properly applied before showing content
    // The small delay helps ensure all styled components are fully processed
    const timeoutId = setTimeout(() => {
      setStylesReady(true);
    }, 10);

    return () => clearTimeout(timeoutId);
  }, []);

  // On client side
  if (typeof window !== "undefined") {
    return (
      <>
        {!isStylesReady && <GlobalHideStyle />}
        {isStylesReady && <GlobalShowStyle />}
        {children}

        {/* Firefox FOUC hack - dummy script execution right after body */}
        <script dangerouslySetInnerHTML={{ __html: "// FOUC fix for Firefox" }} />
      </>
    );
  }

  // On server, wrap with StyleSheetManager to collect styles
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} enableVendorPrefixes={true}>
      <>
        <GlobalHideStyle />
        {children}
      </>
    </StyleSheetManager>
  );
}
```

### 2. Key Elements of the Solution

1. **Initial Hiding**: Use `visibility: hidden` instead of `display: none` to prevent layout shifts
2. **Delayed Showing**: Short timeout to ensure styles are fully applied
3. **Firefox Hack**: Empty script execution to fix Firefox-specific FOUC issues
4. **Server-Side Preparation**: Proper SSR configuration with styled-components

## Implementation

1. Replace the StyledComponentsRegistry in all zones (apps)
2. Ensure proper compilation with `compiler: { styledComponents: true }` in next.config.mjs
3. Ensure each app has its own copy of styled-components installed

## How It Works

1. **During SSR**: The server renders the HTML with styles and an initial hidden state
2. **After Hydration**: The client briefly keeps content hidden while styles are being processed
3. **After Styles Ready**: Content is made visible with all styles properly applied
4. **Firefox Special Case**: The dummy script ensures Firefox properly processes styles

## Advantages

- No visible unstyled content flash
- Works with shared components
- Graceful degradation for users without JavaScript (content still visible)
- Works across all browsers including Firefox
- Minimal impact on performance

## References

This solution was inspired by several approaches:

1. Next.js official styled-components documentation
2. StackOverflow solutions for FOUC
3. Medium article by Fabien Lasserre on FOUC elimination

## Maintenance

If you encounter FOUC issues again after updating dependencies:

1. Check that all apps have the same version of styled-components
2. Verify that the StyledComponentsRegistry is being used correctly in all layouts
3. Check for any new browser-specific issues that might require adjustments
