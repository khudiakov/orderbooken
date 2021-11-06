import * as React from "react";
import { OfferType } from "../constants";
import { useDimensions } from "../hooks/useDimensions";
import { getOfferColor, numberFormat, priceFormat } from "../utils";
import { OffersHeader } from "./offers-header";

const NumberComponent = ({
  value,
  price,
}: {
  value: number;
  price?: OfferType;
}) => {
  let style = undefined;
  if (price != null) {
    style = {
      color: getOfferColor(price),
    };
  }

  return (
    <span className="flex1 number" style={style}>
      {price != null ? priceFormat.format(value) : numberFormat.format(value)}
    </span>
  );
};

const NumberMemo = React.memo(NumberComponent);

const OfferComponent = ({
  total,
  size,
  price,
  type,
  revert,
  maxTotal,
}: {
  total: number;
  size: number;
  price: number;
  type: OfferType;
  maxTotal: number;
  revert?: boolean;
}) => {
  const totalPercentage = Math.round((total / maxTotal) * 10000) / 100;
  const background =
    `linear-gradient(${revert ? "to right" : "to left"},` +
    ` ${getOfferColor(type, true)}` +
    ` ${totalPercentage}%, transparent ${totalPercentage}% )`;

  return (
    <div className={`offer ${revert ? "flex-row-reverse" : "flex-row"}`}>
      <NumberMemo value={total} />
      <NumberMemo value={size} />
      <NumberMemo value={price} price={type} />
      <div className="offer-background" style={{ background }} />
    </div>
  );
};

const OfferMemo = React.memo(OfferComponent);

export const Offers = ({
  type,
  offers,
  total: maxTotal,
}: {
  type: OfferType;
  offers: IOffer[];
  total: number;
}) => {
  const targetRef = React.useRef<HTMLDivElement | null>(null);
  const { height } = useDimensions(targetRef);

  const offerHeight = React.useMemo(() => {
    const height = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--offer-min-height");
    const heightMatch = height.match(/(\d+)px/);
    if (heightMatch == null) {
      console.error(`Can't parse height of offer element`);
      return 1;
    }
    return parseInt(heightMatch[1], 10);
  }, []);

  return (
    <div className="offers flex1">
      <OffersHeader revert={type === OfferType.Bid} />
      <div
        ref={targetRef}
        className={`offers-${type === OfferType.Ask ? "asks" : "bids"}`}
      >
        {offers
          .slice(0, height > 0 ? Math.floor(height / offerHeight) : undefined)
          .map(({ total, size, price }) => (
            <OfferMemo
              key={price.toString()}
              total={total}
              size={size}
              price={price}
              type={type}
              maxTotal={maxTotal}
              revert={type === OfferType.Bid}
            />
          ))}
      </div>
    </div>
  );
};
