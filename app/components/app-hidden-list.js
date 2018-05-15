import {h} from 'hyperapp';

import AppList from './app-list';

const tapDelay = 400;
const hiddenStyles = {
    height: '100px'
};

export default (state, actions) => {
    const $element = h('div', {
        style: hiddenStyles,
        oncreate: onCreate(state, actions),
        ondestroy: (element) => element.unsubscribeDoubleCLick()
    }, []);

    return state.hiddenListVisible ? AppList : $element;
};

function onCreate(state, actions) {
    return (element) => {
        const unsubscribe = doubleClick(element)
            .subscribe(() => {
                actions.showHiddenList();
                unsubscribe();
            });

        element.unsubscribeDoubleCLick = unsubscribe;
    }
}

function doubleClick(element) {
    return {
        subscribe(callback) {
            element.addEventListener('click', onClick);

            function onClick() {
                const clickTime = new Date();

                element.addEventListener('click', onNextClick);

                function onNextClick() {
                    element.removeEventListener('click', onNextClick);

                    if (new Date() - clickTime < tapDelay) {
                        callback();
                    }
                }
            }

            return () => {
                element.removeEventListener('click', onClick);
            };
        }
    }
}