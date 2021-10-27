import * as React from "react";

const OffersHeaderLabel = ({ text }: { text: string }) => (
  <span className="flex1 label">{text}</span>
);

const OffersHeaderComponent = ({
  className,
  revert,
}: {
  className?: string;
  revert?: boolean;
}) => (
  <div
    className={`offers-header ${revert ? "flex-row-reverse" : "flex-row"} ${
      className ?? ""
    }`}
  >
    <OffersHeaderLabel text="Total" />
    <OffersHeaderLabel text="Size" />
    <OffersHeaderLabel text="Price" />
  </div>
);

const OffersHeaderMemo = React.memo(OffersHeaderComponent);

export const OffersHeader = OffersHeaderMemo;
