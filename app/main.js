import { h, app } from 'hyperapp';

import '../node_modules/bulma/css/bulma.css';

import AppTitle from './components/app-title';
import AppContent from './components/app-content';

const state = {
    wateringDate: new Date()
};

const actions = {
    down: value => state => ({ count: state.count - value }),
    up: value => state => ({ count: state.count + value }),
    waterFlower: () => state => {
        return Object
            .assign(
                {},
                state,
                {wateringDate: new Date()}
            );
    }
};

const view = (state, actions) =>
    h('section', {class: 'section'}, [
        h('div', {class: 'container'}, [
            AppTitle,
            AppContent
        ])
    ]);

app(state, actions, view, document.body);