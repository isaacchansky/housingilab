import {BuildingRender} from './BuildingRender';
import {throttle, scrollTo, getScrollOffset, isScrolledIntoView} from './util';
import outcomeTemplating from './lesson-outcome-templating';
import * as $ from 'jquery';


let br: BuildingRender;
let handleActiveRender: any;


// To be called after DOMContentLoaded
function scrollEventHandling() {
    let pageContent = $('.page-content');
    let currentMenuItem = document.querySelector(".menu__current-item");

    function handleScroll() {
        let currentLesson = null;
        if (pageContent[0].getBoundingClientRect().top <= 0) {
            pageContent.addClass('is-scrolled');
        } else {
            pageContent.removeClass('is-scrolled');
        }
        $('.lesson-modules [data-lesson]').each( (i, lessonModule: any) => {
            if ( isScrolledIntoView(lessonModule)) {
                let title = lessonModule.querySelector('.lesson__title').textContent;
                currentMenuItem.textContent = title;
                currentLesson = lessonModule;
            }
        });

        if (currentLesson) {
            let currentLessonNumber = $(currentLesson).data('lesson');
            // TODO: throttle this.
            // history.pushState({ lesson: currentLessonNumber }, 'Lesson ${currentLessonNumber}', `${location.origin}${location.pathname}#lesson-${currentLessonNumber}`);
        }
    }

    // fire once then listen
    handleScroll();
    window.addEventListener('scroll', throttle(handleScroll, 10));

}

// To be called after DOMContentLoaded
function clickEventHandling() {

    $('#start').on('click', () => {
        scrollTo(getScrollOffset($('.lesson-modules')[0]), 600);
    });

    $(".visualization-module__toggle").on('click', () => {
        $(".visualization-module__outcomes").toggleClass('is-closed');
    });

    $(".button--next-lesson").on('click', (e) => {
        br.resetZoom();
        handleActiveRender();
        $('.page-content').removeClass('has-interaction');
        let lesson = $(e.currentTarget).closest('[data-lesson]').data('lesson');
        $(`[data-lesson="${lesson+1}"]`).show();
        scrollTo(getScrollOffset(e.currentTarget.parentElement.nextElementSibling), 600);
        // TODO: enable this when we think through 'previous lesson' buttons.
        // setTimeout( () => {
        //     $(`[data-lesson="${lesson}"]`).hide();
        // }, 600);
    });

    let toc = $('.table-of-contents');
    $('.menu-toggle').on('click', (e) => {
        toc.toggleClass('is-open');
    });

    $(".table-of-contents a").on('click', (e) => {
        toc.removeClass("is-open");
    });

}


function setOutcomes(s: any, lesson: number) {
    let outcomeHTML = outcomeTemplating(s, lesson);

    $(".visualization-module__quick-outcome").html(outcomeHTML.summary);
    $(".visualization-module__outcomes-content").html(outcomeHTML.full);
}

function initThree() {
    let animateTimer: any;
    let vizSpace = <HTMLElement>document.querySelector('.visualization-module__canvas')

    br = new BuildingRender(vizSpace);
    br.init();


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

    // handle zoom buttons
    let zoomIn = $('.visualization-module__zoom-in');
    let zoomOut = $('.visualization-module__zoom-out');
    zoomIn.on('click', () => {
        br.increaseZoom();
        handleActiveRender();
    });
    zoomOut.on('click', () => {
        br.decreaseZoom();
        handleActiveRender();
    });

    let renderOptionDefaults: any = {
        type: 'Standard',
        rentScenario: 'deepAffordability',
        ratioParking: '0.0',
        numFloors: '3',
        numApts: '9'
    };
    let activeRenderOptions: any = {};

    br.renderScenario(renderOptionDefaults);

    let $option = $('.options__field[data-label] input');
    $option.on('change', (event) => {
        let val = $(event.currentTarget).val();
        let dataLabel = $(event.currentTarget).closest('[data-label]').data('label');
        let lesson = $(event.currentTarget).closest('[data-lesson]').data('lesson');

        activeRenderOptions[dataLabel] = val.toString();

        let options = Object.assign({},renderOptionDefaults, activeRenderOptions);
        let outcomes = br.getOutcomes(options);

        setOutcomes(outcomes, lesson);
        br.renderScenario(options);

        $('.page-content').addClass('has-interaction');
    });

}



// Page load initialization
(function(){

    document.addEventListener('DOMContentLoaded', (event) => {

        scrollEventHandling();
        clickEventHandling();
        initThree();
        handleActiveRender();
    });

})();

