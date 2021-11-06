import * as React from "react";

export const useDimensions = (
  targetRef: React.MutableRefObject<HTMLElement | null>
) => {
  const [dimensions, setDimensions] = React.useState({
    width: targetRef.current?.offsetWidth ?? 0,
    height: targetRef.current?.offsetHeight ?? 0,
  });
  const debounceTimeoutRef = React.useRef<undefined | NodeJS.Timeout>();
  const updateDimensions = React.useCallback(() => {
    if (!targetRef.current) {
      return;
    }

    setDimensions({
      width: targetRef.current.offsetWidth,
      height: targetRef.current.offsetHeight,
    });
  }, [targetRef]);
  React.useEffect(() => {
    updateDimensions();
    const onResize = () => {
      debounceTimeoutRef.current && clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(updateDimensions, 500);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      debounceTimeoutRef.current && clearTimeout(debounceTimeoutRef.current);
    };
  }, [updateDimensions]);
  return dimensions;
};
