import * as React from "react";
import { OfferType } from "../constants";
import { getOfferColor, numberFormat, priceFormat } from "../utils";

const OffersHeaderLabel = ({ text }: { text: string }) => (
  <span className="flex1 label">{text}</span>
);

const OffersHeaderComponent = ({ revert }: { revert?: boolean }) => (
  <div className={`offers-header ${revert ? "flex-row-reverse" : "flex-row"}`}>
    <OffersHeaderLabel text="Total" />
    <OffersHeaderLabel text="Size" />
    <OffersHeaderLabel text="Price" />
  </div>
);

const OffersHeaderMemo = React.memo(OffersHeaderComponent);

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
    <div
      className={`offer ${revert ? "flex-row-reverse" : "flex-row"}`}
      style={{ background }}
    >
      <NumberMemo value={total} />
      <NumberMemo value={size} />
      <NumberMemo value={price} price={type} />
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
  return (
    <div className="flex1">
      <OffersHeaderMemo />
      {offers.map(({ total, size, price }) => (
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
  );
};
