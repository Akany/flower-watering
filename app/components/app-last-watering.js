import {h} from 'hyperapp';
import moment from 'moment';

export default (state, actions) => {
    return h('div', {class: 'subtitle'}, [
        h('div', {}, 'Last watering date: '),
        h(
            'div',
            {class:
                [
                    'has-text-weight-semibold has-text-right',
                    statusToClass(state.wateringStatus)
                ].join(' ')
            },
            state.loading ? 'Fetching...' : formatDate(state.wateringDate))
    ]);

}

function formatDate(date) {
    return moment(date).fromNow();
}

function statusToClass(status) {
    switch (status) {
        case 'warning':
            return 'has-text-warning';
        case 'danger':
            return 'has-text-danger';
        default:
            return 'has-text-dark';
    }
}