import { OrderbookComponent } from './orderbook'

import { ComponentStory, ComponentMeta } from '@storybook/react';

import FIXTURE from "./orderbook.fixture.json";

export default {
    title: 'Orderbook',
    component: OrderbookComponent,
} as ComponentMeta<typeof OrderbookComponent>;

const Template: ComponentStory<typeof OrderbookComponent> = (args) => <div id="app"><OrderbookComponent {...args} /></div>

export const Primary = Template.bind({});

Primary.args = {
    ready: FIXTURE.ready,
    spread: FIXTURE.spread,
    spreadPercentage: FIXTURE.spreadPercentage,
    asks: FIXTURE.asks,
    bids: FIXTURE.bids,
    onToggle: () => undefined
};
Primary.parameters = {
    layout: "fullscreen"
}