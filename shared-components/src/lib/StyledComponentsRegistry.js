"use client";

import React, { useState, useEffect } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager, createGlobalStyle } from "styled-components";

// Global style to initially hide content until styles are applied
const GlobalHideStyle = createGlobalStyle`
  html {
    visibility: hidden;
    opacity: 0;
  }
`;

// Global style to show content when everything is ready
const GlobalShowStyle = createGlobalStyle`
  html {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.1s ease;
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
    // Set styles ready immediately after hydration
    const timer = setTimeout(() => {
      setStylesReady(true);
    }, 50); // Small delay to ensure styles are processed

    return () => clearTimeout(timer);
  }, []);

  // On client side
  if (typeof window !== "undefined") {
    return (
      <>
        {!isStylesReady && <GlobalHideStyle />}
        {isStylesReady && <GlobalShowStyle />}
        {children}

        {/* Firefox FOUC hack - dummy script execution */}
        <script dangerouslySetInnerHTML={{ __html: "// FOUC fix for Firefox" }} />

        {/* Fallback for users with JavaScript disabled */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            html { 
              visibility: visible !important;
              opacity: 1 !important;
            }
          `,
            }}
          />
        </noscript>
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
