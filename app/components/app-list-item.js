import {h} from 'hyperapp';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

export default (state) =>
    h('tr', {}, [
        h('td', {class: 'has-text-centered'}, formatDate(state.date))
    ]);

function formatDate(date) {
    return moment(date)
        .format(DATE_FORMAT);
}