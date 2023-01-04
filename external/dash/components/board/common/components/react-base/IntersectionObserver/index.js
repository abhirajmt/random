import React, { useEffect, useRef } from "react";
// const React = window.React;
// const { useEffect, useRef } = React;

export const IntersectionObserverWrapper = ({
  once = false,
  top = 0,
  bottom = 0,
  left = 0,
  right = 0,
  onChange = () => null,
  children,
}) => {
  console.log('....in io')
  const containerRef = useRef();
  const container = containerRef.current;

  const handler = () => {
    const bcr = container.getBoundingClientRect();
    const intersecting =
      bcr.bottom + bottom > 0 &&
      bcr.right + right > 0 &&
      bcr.top - top < window.innerHeight &&
      bcr.left - left < window.innerWidth;

    onChange(intersecting);

    if (intersecting && once) {
      window.removeEventListener("scroll", handler);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver !== "undefined") {
      const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;

      const observer = new IntersectionObserver(
        entries => {
          const intersecting = entries[0].isIntersecting;
          onChange(intersecting);
          if (intersecting && once) {
            observer.unobserve(container);
          }
        },
        {
          rootMargin,
        }
      );

      observer.observe(container);
      return () => observer.unobserve(container);
    }
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default IntersectionObserverWrapper;
