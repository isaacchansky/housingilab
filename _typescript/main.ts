import scrollTo from './scrollTo.module';
import {BuildingRender} from './BuildingRender';
import * as $ from 'jquery';


let br: BuildingRender;
let handleActiveRender: any;

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
    let currentMenuItem = document.querySelector(".menu__current-item");
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
                let title = lessonModule.querySelector('.lesson__title').textContent;
                currentMenuItem.textContent = title;
                let inputOptions = nodelistToArray(document.querySelectorAll('.visualization-module__options [data-lesson]'));
                inputOptions.forEach( (el: any) => {
                    el.classList.remove('is-visible');
                    el.classList.add('is-hidden');
                });
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
            handleActiveRender();
        })
    });

    let menuToggle = document.querySelector('.menu-toggle');
    let toc = document.querySelector('.table-of-contents');
    menuToggle.addEventListener('click', (e) => {
        toc.classList.toggle('is-open');
    });

    let menuLinks = document.querySelectorAll(".table-of-contents a");
    for (let index = 0; index < menuLinks.length; index++) {
        menuLinks[index].addEventListener('click', (e) => {
            toc.classList.remove("is-open");
        });
    }

}

function setOutcomes(outcomes: any) {
    console.log(outcomes);
    $(".visualization-module__quick-outcome").html(`${outcomes.totalUnits} units, ${outcomes.totalArea}m<sup>2</sup>`);
    $(".visualization-module__outcomes-content").html(`
        <p><strong>Total Units</strong> ${outcomes.totalUnits}</p>
        <p><strong>Total Area</strong> ${outcomes.totalArea}m<sup>2</sup></p>
        <p><strong>Types of Units</strong> ${outcomes.types}</p>
    `);
}

function initThree() {
    let vizSpace = <HTMLElement>document.querySelector('.visualization-module__canvas')
    br = new BuildingRender(vizSpace);
    br.init();

    let animateTimer: any;

    handleActiveRender = throttle(function () {
        br.isAnimating = true;
        br.animate();
        if (animateTimer) {
            window.clearTimeout(animateTimer);
        }
        animateTimer = window.setTimeout(() => {
            br.isAnimating = false;
        }, 1000);
    }, 1000);

    vizSpace.addEventListener('mousemove', handleActiveRender);

    // add axis to the scene
    // let axis = new THREE.AxesHelper(10)
    // scene.add(axis)

    // handle zoom buttons
    let zoomIn = document.querySelector('.visualization-module__zoom-in');
    let zoomOut = document.querySelector('.visualization-module__zoom-out');
    zoomIn.addEventListener('click', () => {
        br.increaseZoom();
        handleActiveRender();
    });
    zoomOut.addEventListener("click", () => {
        br.decreaseZoom();
        handleActiveRender();
    });

    let renderOptions = {
        parking: '0.0',
        floors: '3',
        apts: '9'
    };
    br.rerenderBuilding({ size: "large" });

    let $parkingSelect = $('input[name="parking-ratio"]');
    $parkingSelect.on('change', (event) => {
        let val = $(event.target).val();
        renderOptions.parking = val.toString();
        let outcomes = br.getOutcomes(renderOptions);
        setOutcomes(outcomes);
        br.renderScenario(renderOptions);
    });

    let $floorsSelect = $('input[name="floors"]');
    $floorsSelect.on('change', (event) => {
        let val = $(event.target).val();
        renderOptions.floors = val.toString();
        let outcomes = br.getOutcomes(renderOptions);
        setOutcomes(outcomes);
        br.renderScenario(renderOptions);
    });

    let $apartmentSelect = $('input[name="apartments"]');
    $apartmentSelect.on('change', (event) => {
        let val = $(event.target).val();
        renderOptions.apts = val.toString();
        let outcomes = br.getOutcomes(renderOptions);
        setOutcomes(outcomes);
        br.renderScenario(renderOptions);
    });



}

(function(){

    document.addEventListener('DOMContentLoaded', (event) => {

        scrollEventHandling();
        clickEventHandling();
        initThree();
        handleActiveRender();

    });


})();

