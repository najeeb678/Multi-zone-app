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
