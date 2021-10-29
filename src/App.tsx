import * as React from "react";
import "./App.css";
import { Orderbook } from "./components/orderbook";
import { useFocusHandler } from "./useFocusHandler";

function App() {
  const { suspended, onContinue } = useFocusHandler();
  const [productId, setProductId] = React.useState<TProductId>("PI_XBTUSD");

  const onToggle = React.useCallback(() => {
    setProductId((productId) =>
      productId === "PI_ETHUSD" ? "PI_XBTUSD" : "PI_ETHUSD"
    );
  }, []);

  return (
    <div id="app">
      {suspended ? (
        <button className="button" onClick={onContinue}>
          I'm back!
        </button>
      ) : (
        <Orderbook productId={productId} onToggle={onToggle} />
      )}
    </div>
  );
}

export default App;
