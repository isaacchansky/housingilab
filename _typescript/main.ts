import {BuildingRender} from './BuildingRender';
import {throttle, scrollTo, getScrollOffset, isScrolledIntoView} from './util';
import outcomeTemplating from './lesson-outcome-templating';
import * as $ from 'jquery';


let br: BuildingRender;
let handleActiveRender: any;
let defaultRenderOptionsByLesson: any = {};
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

// To be called after DOMContentLoaded
function scrollEventHandling() {
    let pageContent = $('.page-content');
    let currentMenuItem = document.querySelector(".menu__current-item");
    let currentMenuSection = document.querySelector(".menu__current-item-section");

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
                let isInOptions = isScrolledIntoView(lessonModule.querySelector('.options'));

                currentMenuItem.textContent = title;
                currentMenuSection.textContent = isInOptions ? 'Interactive' : 'Lesson';
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

    $(".outcomes__toggle").on('click', () => {
        $(".outcomes").toggleClass('is-closed');
    });

    $(".button--next-lesson").on('click', (e) => {
        br.resetZoom();
        handleActiveRender();
        $('.page-content').removeClass('has-interaction');
        let lesson = $(e.currentTarget).closest('[data-lesson]').data('lesson');
        $(`[data-lesson="${lesson+1}"]`).show();
        scrollTo(getScrollOffset(e.currentTarget.parentElement.nextElementSibling), 600);

        br.renderScenario( Object.assign({}, renderOptionDefaults, defaultRenderOptionsByLesson[lesson+1]));
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
        let lesson = parseInt($(e.currentTarget).data('targetlesson'), 10);
        for (let i=1; i <= lesson; i++) {
            $(`[data-lesson="${i}"]`).show();
        }
    });


}


function setOutcomes(s: any, lesson: number) {
    let outcomeHTML = outcomeTemplating(s, lesson);
    $(".outcomes__content").html(outcomeHTML);
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

    $('[data-lesson]').each((i, el) => {
        let massing = $(el).find('[data-massing]').data('massing');
        if (massing) {
            massing = massing.split('|');
            defaultRenderOptionsByLesson[$(el).data('lesson')] = {
                numApt: massing[0],
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

