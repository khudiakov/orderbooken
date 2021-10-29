import * as React from "react";
import { OfferType } from "../constants";
import { useOrderbook } from "../useOrderbook";
import { getSpreadText } from "../utils";
import { Header } from "./header";
import { Offers } from "./offers";
import { OffersHeader } from "./offers-header";

interface IOrderbookComponentProps {
  spread: number;
  spreadPercentage: number;
  asks: IOrderbookOffers;
  bids: IOrderbookOffers;
  ready: boolean;
  onToggle: () => void;
}

export const OrderbookComponent = ({
  spread,
  spreadPercentage,
  asks,
  bids,
  ready,
  onToggle,
}: IOrderbookComponentProps) => {
  const maxTotal = Math.max(asks.total, bids.total);

  return (
    <>
      <Header spread={spread} spreadPercentage={spreadPercentage} />
      <OffersHeader className="portrait" revert />
      <div className="content">
        <Offers type={OfferType.Ask} offers={asks.offers} total={maxTotal} />
        <span className="label portrait">
          {getSpreadText({ spread, spreadPercentage })}
        </span>
        <Offers type={OfferType.Bid} offers={bids.offers} total={maxTotal} />
      </div>
      <div className="footer">
        <button className="button" disabled={!ready} onClick={onToggle}>
          Toggle Feed
        </button>
      </div>
    </>
  );
};

const OrderbookContainer = ({
  productId,
  onToggle,
}: {
  productId: TProductId;
  onToggle: () => void;
}) => {
  const { ready, spread, spreadPercentage, asks, bids } = useOrderbook({
    productId,
  });

  return (
    <OrderbookComponent
      spread={spread}
      spreadPercentage={spreadPercentage}
      ready={ready}
      onToggle={onToggle}
      asks={asks}
      bids={bids}
    />
  );
};

const OrderbookMemo = React.memo(OrderbookContainer);

export const Orderbook = OrderbookMemo;
