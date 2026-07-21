import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Scroll window to top on route change
    window.scrollTo(0, 0);

    // 2. Ensure body & html scrollable state is restored
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }, [pathname]);

  return null;
}
