import {h} from 'hyperapp';

import AppLastWatering from './app-last-watering';
import AppWaterFlower from './app-water-flower';

export default () =>
    h('div', {class: 'content'}, [
        AppLastWatering,
        AppWaterFlower
    ]);