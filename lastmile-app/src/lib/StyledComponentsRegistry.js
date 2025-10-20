"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export function StyledComponentsRegistry({ children }) {
  // ✅ Create the sheet once per render cycle
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    // Clear the tags after extracting to avoid duplicate/accumulated styles
    styledComponentsStyleSheet.instance.clearTag();
    // ❌ Don't seal here — let Next.js finish the render cycle first
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") {
    // ✅ Client side — no StyleSheetManager needed
    return <>{children}</>;
  }

  return <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>;
}
