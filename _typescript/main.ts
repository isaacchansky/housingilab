import {BuildingRender} from './BuildingRender';
import {throttle, scrollTo, getScrollOffset, isScrolledIntoView} from './util';
import outcomeTemplating from './lesson-outcome-templating';
import * as $ from 'jquery';


let br: BuildingRender;
let handleActiveRender: any;
let defaultRenderOptionsByLesson: any = {};
let currentLesson:any = null;
let previousLesson:any = null;
let activeRenderOptions: any = {};

let renderOptionDefaults: any = {
        type: 'Standard',
        rentScenario: 'deepAffordability',
        ratioParking: '0.0',
        numFloors: '3',
        numApts: '9'
    };


 function buildMenu() {
     // calculate menu
    let menuStructure = $('[data-lesson]').map((i, el) => {
        let lesson = $(el).data('lesson');
        let sections = $(el).find('h3').map( (i,el) => {
            return `<li><a data-menulink data-targetlesson="${lesson}" href="#${$(el).attr('id')}">${$(el).text()}</a></li>`;
        }).toArray().join('');
        return `<li><a data-menulink data-targetlesson="${lesson}" href="#${$(el).attr('id')}">${$(el).find('.lesson__title').text()}</a><ul>${sections}</ul></li>`;
    }).toArray().join('');

    $('.table-of-contents__list').append(menuStructure);
 }



function setOutcomes(s: any, lesson: number) {
    let outcomeHTML = outcomeTemplating(s, lesson);
    $(".outcomes__content").html(outcomeHTML);
}


 function newSectionReset(lessonIndex: number) {
     if (br) {
        br.resetZoom();
        handleActiveRender();
        $('.page-content').removeClass('has-interaction');
        $(`[data-lesson="${lessonIndex}"]`).show();
        renderOptionDefaults = Object.assign({}, renderOptionDefaults, defaultRenderOptionsByLesson[lessonIndex]);
        activeRenderOptions = {};
        br.renderScenario( Object.assign({}, renderOptionDefaults, defaultRenderOptionsByLesson[lessonIndex]));
     }
 }

// To be called after DOMContentLoaded
function scrollEventHandling() {
    let pageContent = $('.page-content');
    let currentMenuItem = document.querySelector(".menu__current-item");
    let currentMenuSection = document.querySelector(".menu__current-item-section");

    function handleScroll() {
        if (pageContent[0].getBoundingClientRect().top <= 0) {
            pageContent.addClass('is-scrolled');
        } else {
            pageContent.removeClass('is-scrolled');
        }
        $('.lesson-modules [data-lesson]').each( (i, lessonModule: any) => {
            if (isScrolledIntoView(lessonModule)) {
                let title = lessonModule.querySelector('.lesson__title').textContent;
                let options = lessonModule.querySelector('.options');
                let isInOptions;
                if (options) {
                    isInOptions = isScrolledIntoView(lessonModule.querySelector('.options'));
                    currentMenuSection.textContent = isInOptions ? 'Interactive' : 'Lesson';
                } else {
                    currentMenuSection.textContent = '';
                }

                currentMenuItem.textContent = title;
                currentLesson = lessonModule;
            }
        });

        if (previousLesson === null) {
            // initially, set as the same
            previousLesson = currentLesson;
        }

        if (currentLesson) {
            let currentLessonNumber = $(currentLesson).data('lesson');
            if (currentLesson !== previousLesson) {
                if (currentLessonNumber) {
                    currentLessonNumber = parseInt(currentLessonNumber, 10);
                    newSectionReset(currentLessonNumber);
                    previousLesson = currentLesson;
                }
            }
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

    $(".outcomes__toggle").on('click', () => {
        $(".outcomes").toggleClass('is-closed');
    });

    $(".button--next-lesson").on('click', (e) => {
        let lesson = $(e.currentTarget).closest('[data-lesson]').data('lesson');
        if (lesson !== undefined) {
            lesson = parseInt(lesson, 10);
            // reset for next lesson
            newSectionReset(lesson+1);
            scrollTo(getScrollOffset(e.currentTarget.parentElement.nextElementSibling), 600);
        }
    });

    let toc = $('.table-of-contents');
    $('.menu-toggle').on('click', (e) => {
        toc.toggleClass('is-open');
    });

    $(".table-of-contents a").on('click', (e) => {
        toc.removeClass("is-open");
        let lesson = parseInt($(e.currentTarget).data('targetlesson'), 10);
        for (let i=1; i <= lesson; i++) {
            $(`[data-lesson="${i}"]`).show();
        }
    });


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


    // Set up default rendering options for each lesson
    $('[data-lesson]').each((i, el) => {
        let massing = $(el).find('[data-massing]').data('massing');
        if (massing) {
            massing = massing.split('|');
            defaultRenderOptionsByLesson[$(el).data('lesson')] = {
                numApts: massing[0],
                numFloors: massing[1],
                ratioParking: massing[2]
            };
            if ($(el).find('[data-rentscenario]').data('rentscenario')) {
                defaultRenderOptionsByLesson[$(el).data('lesson')].rentScenario = $(el).find('[data-rentscenario]').data('rentscenario');
            }
        }
    });


    // default to first lesson configured values
    renderOptionDefaults = Object.assign({}, renderOptionDefaults, defaultRenderOptionsByLesson[1]);
    br.renderScenario(renderOptionDefaults);

    // Handle option changes
    let $option = $('.options__field[data-label] input');
    $option.on('change', (event) => {
        let val = $(event.currentTarget).val();
        let dataLabel = $(event.currentTarget).closest('[data-label]').data('label');
        let lesson = $(event.currentTarget).closest('[data-lesson]').data('lesson');

        activeRenderOptions[dataLabel] = val.toString();

        let options = Object.assign({}, renderOptionDefaults, activeRenderOptions);
        let outcomes = br.getOutcomes(options);

        setOutcomes(outcomes, lesson);
        br.renderScenario(options, outcomes);

        if (!$('.page-content').hasClass('has-interaction')) {
            br.setFocusedZoom();
            handleActiveRender();
            $('.page-content').addClass('has-interaction');
        }

    });



}



// Page load initialization
(function(){

    document.addEventListener('DOMContentLoaded', (event) => {
        buildMenu();
        scrollEventHandling();
        clickEventHandling();
        initThree();
        handleActiveRender();
    });

})();

