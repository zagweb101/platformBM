"use client";

import { useEffect, useState } from "react";

export function useAuthRedirectParam(defaultPath = "/") {
  const [redirectTo, setRedirectTo] = useState(defaultPath);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const target =
      params.get("callbackUrl") || params.get("from") || defaultPath;
    setRedirectTo(target);
  }, [defaultPath]);

  return redirectTo;
}

export function buildAuthQuery(redirectTo: string, param: "from" | "callbackUrl" = "from") {
  if (!redirectTo || redirectTo === "/") return "";
  return `?${param}=${encodeURIComponent(redirectTo)}`;
}
