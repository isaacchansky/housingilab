import scrollTo from './scrollTo.module';
import {BuildingRender} from './BuildingRender';
import * as $ from 'jquery';


let br: BuildingRender;

function getScrollOffset(element:any) {
    let scrolledAmt = document.documentElement.scrollTop;
    return scrolledAmt + element.getBoundingClientRect().top;
}

const throttle = (func: Function , limit: Number) => {
    let inThrottle: boolean;
    return function () {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

function isScrolledIntoView(el: any) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Partially visible elements return true:
    let isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

function nodelistToArray(nodelist: NodeList) {
    return Array.prototype.slice.call(nodelist);
}


// To be called after DOMContentLoaded
function scrollEventHandling() {
    let pageContent = document.querySelector('.page-content');
    // fire once then listen

    let lessonSections = nodelistToArray(document.querySelectorAll('.lesson-modules [data-lesson]'));

    handleScroll();
    window.addEventListener('scroll', throttle(handleScroll, 10));

    function handleScroll() {
        if (pageContent.getBoundingClientRect().top <= 0) {
            pageContent.classList.add('is-scrolled');
        } else {
            pageContent.classList.remove('is-scrolled');
        }
        lessonSections.forEach( (lessonModule: any) => {
            if ( isScrolledIntoView(lessonModule)) {
                let inputOptions = nodelistToArray(document.querySelectorAll('.visualization-module__options [data-lesson]'));
                inputOptions.forEach( (el: any) => {
                    el.classList.remove('is-visible');
                    el.classList.add('is-hidden');
                });
                let currentOption = document.querySelector(`.visualization-module__options [data-lesson="${lessonModule.dataset.lesson}"]`);
                currentOption.classList.remove('is-hidden');
                currentOption.classList.add('is-visible');
            }
        });
    }
}

// To be called after DOMContentLoaded
function clickEventHandling() {
    let button = document.querySelector('#start');
    button.addEventListener('click', () => {
        scrollTo(getScrollOffset(document.querySelector('.lesson-modules')), 600);
    });

    let nextLessonBtns = nodelistToArray(document.querySelectorAll('.button--next-lesson'));
    nextLessonBtns.forEach((element: any) => {
        element.addEventListener('click', () => {
            scrollTo(getScrollOffset(element.parentElement.nextElementSibling), 600);
            br.resetZoom();
            br.rerenderBuilding({ size: 'large' });
        })
    });
}

function setOutcomes(outcomes: any) {
    console.log(outcomes);
    $(".visualization-module__outcomes").html(`
        <p><strong>Total Units</strong> ${outcomes.totalUnits}</p>
        <p><strong>Total Area</strong> ${outcomes.totalArea}m<sup>2</sup></p>
        <p><strong>Types of Units</strong> ${outcomes.types}</p>
    `);
}

function initThree() {
    let vizSpace = <HTMLElement>document.querySelector('.visualization-module__canvas')
    br = new BuildingRender(vizSpace);
    br.init();

    // add axis to the scene
    // let axis = new THREE.AxesHelper(10)
    // scene.add(axis)

    // handle zoom buttons
    let zoomIn = document.querySelector('.visualization-module__zoom-in');
    let zoomOut = document.querySelector('.visualization-module__zoom-out');
    zoomIn.addEventListener('click', () => {
        br.increaseZoom();
    });
    zoomOut.addEventListener("click", () => {
        br.decreaseZoom();
    });


    let $parkingSelect = $('select[name="Parking Ratio"]');

    $parkingSelect.on('change', (event) => {
        let val = $(event.target).val();
        let outcomes;
        if (val === "0 parking") {
            br.rerenderBuilding({ size: "large" });
            outcomes = br.getOutcomes({ size: 'large' });
        }
        if (val === '0.5 parking') {
            br.rerenderBuilding({ size: 'medium' });
            outcomes = br.getOutcomes({ size: "medium" });
        }
        if (val === '1-1 parking') {
            br.rerenderBuilding({ size: 'small' });
            outcomes = br.getOutcomes({ size: "small" });
        }
        setOutcomes(outcomes);
    });

}

(function(){

    document.addEventListener('DOMContentLoaded', (event) => {

        scrollEventHandling();
        clickEventHandling();
        initThree();


    });


})();

