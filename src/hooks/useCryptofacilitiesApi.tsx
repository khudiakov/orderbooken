import * as React from "react";
import { useIsMounted } from "./useIsMounted";

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
  const isMounted = useIsMounted();

  React.useEffect(
    () => () => {
      if (
        ![webSocket.CLOSING, webSocket.CLOSED].includes(webSocket.readyState)
      ) {
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
      if (!isMounted.current) {
        return;
      }
      setOpening(false);
    };
    webSocket.onerror = (event) => {
      if (!isMounted.current) {
        return;
      }
      const message = `WebSocket error observed: ${event}`;
      console.error(message);
      setError(new Error(message));
      setOpening(false);
    };
    webSocket.onmessage = (event) => {
      if (!isMounted.current) {
        return;
      }
      try {
        const data = JSON.parse(event.data);
        setData(data);
      } catch (e) {
        console.warn(e);
      }
    };
  }, [isMounted, webSocket, setData, productId]);

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
