import { h, app } from 'hyperapp';

import axios from 'axios';

import '../node_modules/bulma/css/bulma.css';

import AppTitle from './components/app-title';
import AppContent from './components/app-content';

const state = {
    wateringDate: null,
    loading: false
};

const actions = {
    putStatus,
    fetchStatus,
    onFetchStatus
};

const view = (state, actions) =>
    h('section', {class: 'section'}, [
        h('div', {class: 'container'}, [
            AppTitle,
            AppContent
        ])
    ]);

const main = app(state, actions, view, document.body);

main.fetchStatus();

function putStatus() {
    return (state, actions) => {
        axios.put('/api/watering', {date: new Date().toISOString()})
            .then((response) => actions.onFetchStatus(response));

        return {loading: true};
    }
}

function fetchStatus() {
    return (state, actions) => {
        axios.get('/api/watering')
            .then(response => {
                return actions.onFetchStatus(response.data)
            });

        return {loading: true};
    };
}

function onFetchStatus(dates) {
    return (state) => {
        return {wateringDate: dates[dates.length], loading: false};
    };
}