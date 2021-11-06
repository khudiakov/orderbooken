import * as React from "react";

export const useIsMounted = () => {
  const isMounted = React.useRef(true);
  React.useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  return isMounted;
};
