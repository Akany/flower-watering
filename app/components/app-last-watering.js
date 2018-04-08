import {h} from 'hyperapp';
import moment from 'moment';

export default (state, actions) => {
    return h('div', {class: 'subtitle'}, [
        h('span', {}, 'Last watering date: '),
        h(
            'span',
            {class: 'has-text-weight-semibold'},
            state.loading ? 'Fetching...' : formatDate(state.wateringDate))
    ]);

}

function formatDate(date) {
    return moment(date).format('MMMM Do');
}