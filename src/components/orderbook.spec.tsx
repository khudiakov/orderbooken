/* eslint-disable */
import { mount } from "@cypress/react";
import { OrderbookComponent } from "./orderbook";
import "../App.css";
import "../index.css";

import FIXTURE from "./orderbook.fixture.json";

describe("Orderbook Component", () => {
  it("render macbook", () => {
    const onToggle = cy.stub();
    mount(
      <div id="app">
        <OrderbookComponent
          ready={FIXTURE.ready}
          spread={FIXTURE.spread}
          spreadPercentage={FIXTURE.spreadPercentage}
          asks={FIXTURE.asks}
          bids={FIXTURE.bids}
          onToggle={onToggle}
        />
      </div>
    );
    cy.contains("Toggle Feed")
      .click()
      .then(() => {
        expect(onToggle).to.be.called;
      });
    cy.percySnapshot("orderbook", { waitForTimeout: 1000 });
  });
});
