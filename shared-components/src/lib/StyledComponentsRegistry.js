"use client";

import React, { useState, useEffect } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager, createGlobalStyle } from "styled-components";

// Global style to hide HTML until styles are applied
const GlobalHide = createGlobalStyle`
  html {
    visibility: hidden;
    opacity: 0;
  }
`;

// Global style to reveal HTML smoothly
const GlobalShow = createGlobalStyle`
  html {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.1s ease;
  }
`;

export function StyledComponentsRegistry({ children }) {
  const [sheet] = useState(() => new ServerStyleSheet());
  const [ready, setReady] = useState(false);

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  useEffect(() => {
    // Reveal the content just after hydration
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // ✅ CLIENT SIDE
  if (typeof window !== "undefined") {
    return (
      <>
        {!ready && <GlobalHide />}
        {ready && <GlobalShow />}
        {children}
      </>
    );
  }

  // ✅ SERVER SIDE
  return (
    <StyleSheetManager sheet={sheet.instance}>
      <GlobalHide />
      {children}
    </StyleSheetManager>
  );
}
