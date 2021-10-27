import * as React from "react";
import { getSpreadText } from "../utils";

const HeaderComponent = ({
  spread,
  spreadPercentage,
}: {
  spread: number;
  spreadPercentage: number;
}) => {
  return (
    <div className="header">
      <span className="flex1">Order Book</span>
      <span className="flex1 label">
        {getSpreadText({ spread, spreadPercentage })}
      </span>
      <div className="flex1" />
    </div>
  );
};
const HeaderMemo = React.memo(HeaderComponent);

export const Header = HeaderMemo;
