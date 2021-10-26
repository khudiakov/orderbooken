import * as React from "react";

import { useCryptofacilitiesApi } from "./useCryptofacilitiesApi";

const EMPTY_RESULT: IOrderbook = {
  spread: 0,
  spreadPercentage: 0,
  asks: { total: 0, offers: [] },
  bids: { total: 0, offers: [] },
};

const entriesToState = (data: TEntry[]) =>
  data.reduce((acc, [k, v]) => {
    acc[k.toString()] = v;
    return acc;
  }, {} as TOrderbookState);

const applyStateUpdate = (update: TEntry[], state: TOrderbookState) =>
  update.reduce(
    (acc, [k, v]) => {
      if (v === 0) {
        delete acc[k.toString()];
        return acc;
      }
      acc[k.toString()] = v;
      return acc;
    },
    { ...state }
  );

const stateToOrderbookResult = (
  state: TOrderbookState,
  { sort, numLevels }: { sort: "ASC" | "DESC"; numLevels: number }
) =>
  Object.keys(state)
    .sort((a, b) => (parseFloat(a) - parseFloat(b)) * (sort === "ASC" ? -1 : 1))
    .slice(0, numLevels)
    .reduce(
      (acc, k) => {
        acc.offers.push({
          total: acc.total + state[k],
          price: parseFloat(k),
          size: state[k],
        });
        acc.total = acc.total + state[k];
        return acc;
      },
      { total: 0, offers: [] } as IOrderbookOffers
    );

export const useOrderbook = (): IOrderbook => {
  const numLevels = React.useRef(0);
  const [asks, setAsks] = React.useState<TOrderbookState>({});
  const [bids, setBids] = React.useState<TOrderbookState>({});

  const { data, error, loading } = useCryptofacilitiesApi();

  React.useEffect(() => {
    if (data == null) {
      return;
    }
    if ("event" in data) {
      if (data["event"] === "info") {
        console.log(`API version is ${data["version"]}`);
      }
      if (data["event"] === "subscribed") {
        console.log(`Client subscribed`);
      }
      return;
    }
    if ("feed" in data) {
      if ("numLevels" in data) {
        numLevels.current = data["numLevels"];
        setAsks(entriesToState(data.asks));
        setBids(entriesToState(data.bids));
        return;
      }
      if (data.asks.length > 0) {
        setAsks((asks) => applyStateUpdate(data.asks, asks));
      }
      if (data.bids.length > 0) {
        setBids((bids) => applyStateUpdate(data.bids, bids));
      }
    }
  }, [data]);

  const orderbookAsks = React.useMemo(
    () =>
      stateToOrderbookResult(asks, {
        sort: "DESC",
        numLevels: numLevels.current,
      }),
    [asks]
  );
  const orderbookBids = React.useMemo(
    () =>
      stateToOrderbookResult(bids, {
        sort: "ASC",
        numLevels: numLevels.current,
      }),
    [bids]
  );

  if (loading || error) {
    return EMPTY_RESULT;
  }

  let spread = 0;
  let spreadPercentage = 0;

  if (orderbookAsks.offers.length > 0 && orderbookBids.offers.length > 0) {
    spread = orderbookAsks.offers[0].price - orderbookBids.offers[0].price;
    spreadPercentage =
      Math.round((spread / orderbookAsks.offers[0].price) * 10000) / 100;
  }

  return {
    spread,
    spreadPercentage,
    asks: orderbookAsks,
    bids: orderbookBids,
  };
};
