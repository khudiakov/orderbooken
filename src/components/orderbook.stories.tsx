import { Orderbook } from './orderbook'

import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: 'Orderbook',
    component: Orderbook,
} as ComponentMeta<typeof Orderbook>;

const Template: ComponentStory<typeof Orderbook> = (args) => <div id="app"><Orderbook {...args} /></div>

export const Primary = Template.bind({});

Primary.args = {
    productId: 'PI_ETHUSD',
    onToggle: () => undefined
};
Primary.parameters = {
    layout: "fullscreen"
}