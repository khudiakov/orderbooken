import "./App.css";
import { Header } from "./components/header";
import { Offers } from "./components/offers";
import { OffersHeader } from "./components/offers-header";
import { OfferType } from "./constants";
import { useOrderbook } from "./useOrderbook";
import { getSpreadText } from "./utils";

function App() {
  const { spread, spreadPercentage, asks, bids } = useOrderbook();
  const maxTotal = Math.max(asks.total, bids.total);

  return (
    <div id="app">
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
        <button className="toggle">Toggle Feed</button>
      </div>
    </div>
  );
}

export default App;
