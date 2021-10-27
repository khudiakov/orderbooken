import { OfferType } from "./constants";

export const getOfferColor = (type: OfferType, isBackground?: boolean) => {
  if (type === OfferType.Ask) {
    return isBackground ? "var(--background-color-ask)" : "var(--color-ask)";
  }
  if (type === OfferType.Bid) {
    return isBackground ? "var(--background-color-bid)" : "var(--color-bid)";
  }
  return undefined;
};

export const numberFormat = new Intl.NumberFormat("en-US");

export const priceFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});

export const getSpreadText = ({
  spread,
  spreadPercentage,
}: {
  spread: number;
  spreadPercentage: number;
}) => `Spread: ${spread.toFixed(1)} (${spreadPercentage}%)`;
