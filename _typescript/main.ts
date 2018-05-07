import { NameClass } from './class/name-class';

import scrollTo from './scrollTo.module';

function getScrollOffset(element:Element) {
    let scrolledAmt = document.documentElement.scrollTop;
    return scrolledAmt + element.getBoundingClientRect().top;
}

(function(){

    document.addEventListener('DOMContentLoaded', (event) => {
        var instance = new NameClass();
        instance.foo();

        let button = document.querySelector('#start');
        button.addEventListener('click', () => {
            scrollTo(getScrollOffset(document.querySelector('.lesson-modules')), 600);
        });

        let nextLessonBtns = Array.prototype.slice.call(document.querySelectorAll('.button--next-lesson'));
        nextLessonBtns.forEach(element => {
            element.addEventListener('click', () => {
                scrollTo(getScrollOffset(element.parentElement.nextElementSibling), 600);

            })
        });

    });


})();

