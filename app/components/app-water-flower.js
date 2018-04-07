import {h} from 'hyperapp';

export default (state, actions) =>
    h('div', {class: 'has-text-centered'}, [
        h(
            'button',
            {
                class: 'button is-primary',
                onclick: () => {
                    actions.waterFlower()
                }
            },
            'Water Flowers'
        )
    ]);