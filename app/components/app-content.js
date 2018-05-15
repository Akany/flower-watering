import {h} from 'hyperapp';

import AppLastWatering from './app-last-watering';
import AppWaterFlower from './app-water-flower';
import AppHiddenList from './app-hidden-list';

export default () =>
    h('div', {class: 'content'}, [
        AppLastWatering,
        AppWaterFlower,
        AppHiddenList
    ]);