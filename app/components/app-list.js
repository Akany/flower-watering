import {h} from 'hyperapp';

import AppListItem from './app-list-item';

export default (state, actions) =>
    h('table', {class: 'table is-striped'}, [
        h('tbody', {}, state
            .wateringDates
            .map(date => AppListItem({date}))
        )
    ]);