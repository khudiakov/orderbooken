type TEntry = [number, number];

interface ISnapshot {
  numLevels: number;
  feed: string;
  product_id: string;
  bids: TEntry[];
  asks: TEntry[];
}

interface IUpdate {
  feed: string;
  product_id: string;
  bids: TEntry[];
  asks: TEntry[];
}

type TOrderbookState = { [price: string]: number };

interface IOffer {
  total: number;
  price: number;
  size: number;
}

interface IOrderbookOffers {
  total: number;
  offers: Array<IOffer>;
}

interface IOrderbook {
  ready: boolean;
  spread: number;
  spreadPercentage: number;
  asks: IOrderbookOffers;
  bids: IOrderbookOffers;
}

type TProductId = "PI_XBTUSD" | "PI_ETHUSD";
