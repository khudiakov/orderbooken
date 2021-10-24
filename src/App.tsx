import "./App.css";
import { useOrderbook } from "./useOrderbook";

function App() {
  const { spread, spreadPercentage, asks, bids } = useOrderbook();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p>
        Spread: {spread.toFixed(1)} ({spreadPercentage}%)
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ul style={{ color: "green" }}>
          {asks.offers.slice(0, 25).map(({ total, size, price }) => (
            <li key={price.toString()}>{`${total}(${Math.round(
              (total / asks.total) * 100
            )}%):${size}:${price}`}</li>
          ))}
        </ul>
        <ul style={{ color: "red" }}>
          {bids.offers.slice(0, 25).map(({ total, size, price }) => (
            <li key={price.toString()}>{`${price}:${size}:${total}(${Math.floor(
              (total / bids.total) * 100
            )}%)`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
