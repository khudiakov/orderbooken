import * as React from "react";

const SUBSCRIBE_MESSAGE = {
  event: "subscribe",
  feed: "book_ui_1",
  product_ids: ["PI_XBTUSD"],
};

const UNSUBSCRIBE_MESSAGE = {
  event: "unsubscribe",
  feed: "book_ui_1",
  product_ids: ["PI_XBTUSD"],
};

const WEB_SOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";

export const useCryptofacilitiesApi = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<undefined | ISnapshot | IUpdate>();
  const [error, setError] = React.useState<undefined | Error>();
  const webSocket = React.useMemo(() => new WebSocket(WEB_SOCKET_URL), []);

  React.useEffect(() => {
    setLoading(true);
    if (webSocket == null) {
      setLoading(false);
      return;
    }

    webSocket.onopen = () => {
      webSocket.send(JSON.stringify(SUBSCRIBE_MESSAGE));
      setLoading(false);
    };
    webSocket.onerror = (event) => {
      const message = `WebSocket error observed: ${event}`;
      console.error(message);
      setError(new Error(message));
      setLoading(false);
    };
    webSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setData(data);
      } catch (e) {
        console.warn(e);
      }
    };
    return () => {
      if (webSocket.readyState === webSocket.OPEN) {
        webSocket.send(JSON.stringify(UNSUBSCRIBE_MESSAGE));
      }
      if (webSocket.readyState !== webSocket.CLOSED) {
        webSocket.close();
      }
    };
  }, [webSocket, setData]);
  return { error, loading, data };
};
