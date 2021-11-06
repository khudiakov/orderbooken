import * as React from "react";
import { useHardwareConcurrency, useMemoryStatus } from "react-adaptive-hooks";
import { useCryptofacilitiesApi } from "./useCryptofacilitiesApi";
import { useIsMounted } from "./useIsMounted";

const EMPTY_RESULT: IOrderbook = {
  ready: true,
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

enum PerformanceBucket {
  Slow = "Slow",
  Medium = "Medium",
  Fast = "Fast",
}
const BUCKET_THROTTLE = {
  [PerformanceBucket.Slow]: 200,
  [PerformanceBucket.Medium]: 50,
  [PerformanceBucket.Fast]: 20,
};
const DEFAULT_PROCESSORS = 4;
const DEFAULT_MEMORY = 16;

const usePerformanceBucket = () => {
  const { numberOfLogicalProcessors = DEFAULT_PROCESSORS } =
    useHardwareConcurrency();
  const { deviceMemory = DEFAULT_MEMORY } = useMemoryStatus();

  return React.useMemo(() => {
    const perfHeuristic = numberOfLogicalProcessors + deviceMemory / 2;
    if (perfHeuristic >= 10) {
      return PerformanceBucket.Fast;
    }
    if (perfHeuristic <= 3) {
      return PerformanceBucket.Slow;
    }
    return PerformanceBucket.Medium;
  }, [numberOfLogicalProcessors, deviceMemory]);
};

function useThrottledState<T>(initialState: T): [T, (fn: (s: T) => T) => void] {
  const isMounted = useIsMounted();
  const perfBucket = usePerformanceBucket();

  const intermediateState = React.useRef(initialState);
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isMounted.current) {
        return;
      }
      setState(intermediateState.current);
    }, BUCKET_THROTTLE[perfBucket]);
    return () => clearInterval(interval);
  }, [perfBucket, isMounted]);

  const setStateThrottled = React.useCallback((fn: (prevState: T) => T) => {
    intermediateState.current = fn(intermediateState.current);
  }, []);

  return [state, setStateThrottled];
}

export const useOrderbook = ({
  productId,
}: {
  productId: TProductId;
}): IOrderbook => {
  const numLevels = React.useRef(0);
  const [asks, setAsks] = useThrottledState<TOrderbookState>({});
  const [bids, setBids] = useThrottledState<TOrderbookState>({});

  const { data, error } = useCryptofacilitiesApi({ productId });
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setReady(false);
  }, [productId]);

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
        setReady(true);
        setAsks(() => entriesToState(data.asks));
        setBids(() => entriesToState(data.bids));
        return;
      }
      if (data.asks.length > 0) {
        setAsks((asks) => applyStateUpdate(data.asks, asks));
      }
      if (data.bids.length > 0) {
        setBids((bids) => applyStateUpdate(data.bids, bids));
      }
    }
  }, [data, setAsks, setBids]);

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

  if (error) {
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
    ready,
    spread,
    spreadPercentage,
    asks: orderbookAsks,
    bids: orderbookBids,
  };
};
