import "./App.css";
import { Header } from "./components/header";
import { Offers } from "./components/offers";
import { OfferType } from "./constants";
import { useOrderbook } from "./useOrderbook";

function App() {
  const { spread, spreadPercentage, asks, bids } = useOrderbook();
  const maxTotal = Math.max(asks.total, bids.total);

  return (
    <div id="app">
      <Header spread={spread} spreadPercentage={spreadPercentage} />
      <div className="offers">
        <Offers type={OfferType.Ask} offers={asks.offers} total={maxTotal} />
        <Offers type={OfferType.Bid} offers={bids.offers} total={maxTotal} />
      </div>
      <div className="footer">
        <button className="toggle">Toggle Feed</button>
      </div>
    </div>
  );
}

export default App;
