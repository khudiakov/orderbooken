import * as React from "react";

const getSubscribeMessage = (productId: TProductId) => ({
  event: "subscribe",
  feed: "book_ui_1",
  product_ids: [productId],
});

const getUnsubscribeMessage = (productId: TProductId) => ({
  event: "unsubscribe",
  feed: "book_ui_1",
  product_ids: [productId],
});

const WEB_SOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";

export const useCryptofacilitiesApi = ({
  productId,
}: {
  productId: TProductId;
}) => {
  const [opening, setOpening] = React.useState(true);
  const [data, setData] = React.useState<undefined | ISnapshot | IUpdate>();
  const [error, setError] = React.useState<undefined | Error>();
  const webSocket = React.useMemo(() => new WebSocket(WEB_SOCKET_URL), []);

  React.useEffect(
    () => () => {
      if (webSocket.readyState !== webSocket.CLOSED) {
        webSocket.close();
      }
    },
    [webSocket]
  );

  React.useEffect(() => {
    if (webSocket == null) {
      setOpening(false);
      return;
    }

    webSocket.onopen = () => {
      setOpening(false);
    };
    webSocket.onerror = (event) => {
      const message = `WebSocket error observed: ${event}`;
      console.error(message);
      setError(new Error(message));
      setOpening(false);
    };
    webSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setData(data);
      } catch (e) {
        console.warn(e);
      }
    };
  }, [webSocket, setData, productId]);

  React.useEffect(() => {
    if (opening) {
      return;
    }

    setData(undefined);
    webSocket.send(JSON.stringify(getSubscribeMessage(productId)));
    return () =>
      webSocket.send(JSON.stringify(getUnsubscribeMessage(productId)));
  }, [opening, webSocket, productId]);
  return { error, data };
};
