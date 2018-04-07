import {h} from 'hyperapp';
import moment from 'moment';

export default (state) =>
    h('div', {class: 'subtitle'}, [
        h('span', {}, 'Last watering date: '),
        h('span', {class: 'has-text-weight-semibold'}, formatDate(state.wateringDate))
    ]);

function formatDate(date) {
    return moment(date).format('MMMM Do');
}