import * as React from "react";

const SUSPEND_TIMEOUT = 5000;

export const useFocusHandler = () => {
  const [suspended, setSuspended] = React.useState(false);
  const [focused, setFocused] = React.useState(true);

  React.useEffect(() => {
    window.onfocus = () => {
      setFocused(true);
    };
    window.onblur = () => {
      setFocused(false);
    };
  }, []);

  React.useEffect(() => {
    if (focused) {
      return;
    }
    let timeout = setTimeout(() => {
      setSuspended(true);
    }, SUSPEND_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    };
  }, [focused]);

  const onContinue = React.useCallback(() => {
    setSuspended(false);
  }, []);
  return { suspended, onContinue };
};
