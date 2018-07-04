import {BuildingRender} from './BuildingRender';
import {throttle, scrollTo, getScrollOffset, isScrolledIntoView, formatCurrency} from './util';
import * as $ from 'jquery';


let br: BuildingRender;
let handleActiveRender: any;


// To be called after DOMContentLoaded
function scrollEventHandling() {
    let pageContent = $('.page-content');
    let currentMenuItem = document.querySelector(".menu__current-item");

    function handleScroll() {
        if (pageContent[0].getBoundingClientRect().top <= 0) {
            pageContent.addClass('is-scrolled');
        } else {
            pageContent.removeClass('is-scrolled');
        }
        $('.lesson-modules [data-lesson]').each( (i, lessonModule: any) => {
            if ( isScrolledIntoView(lessonModule)) {
                let title = lessonModule.querySelector('.lesson__title').textContent;
                currentMenuItem.textContent = title;
            }
        });
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
        scrollTo(getScrollOffset(e.currentTarget.parentElement.nextElementSibling), 600);
        br.resetZoom();
        handleActiveRender();
    });

    let toc = $('.table-of-contents');
    $('.menu-toggle').on('click', (e) => {
        toc.toggleClass('is-open');
    });

    $(".table-of-contents a").on('click', (e) => {
        toc.removeClass("is-open");
    });

}


function setOutcomes(s: any) {
    $(".visualization-module__quick-outcome").html(`
        $${formatCurrency(s.constructionPrice)} - ${s.numApts} units, ${s.numFloors} floors
    `);
    $(".visualization-module__outcomes-content").html(`
        <table>
            <tr>
                <th>Apartments</th>
                <td>${s.calcNumApts}</td>
            </tr>
            <tr>
                <th>Construction Price</th>
                <td class="t-financial">$${formatCurrency(s.constructionPrice)}</td>
            </tr>
            <tr>
                <th>Construction Type</th>
                <td>${s.constructionType}</td>
            </tr>
            <tr>
                <th>Debt Amount</th>
                <td class="t-financial">$${formatCurrency(s.debtAmt)}</td>
            </tr>
            <tr>
                <th>Debt Service Amount</th>
                <td class="t-financial">$${formatCurrency(s.debtServiceAmt)}</td>
            </tr>
            <tr>
                <th>Developer Fee</th>
                <td class="t-financial">$${formatCurrency(s.developerFee)}</td>
            </tr>
            <tr>
                <th>Equity Amount</th>
                <td class="t-financial">$${formatCurrency(s.equityAmt)}</td>
            </tr>
            <tr>
                <th>Expenses Per Apartment</th>
                <td class="t-financial">$${formatCurrency(s.expensesPerApt)}</td>
            </tr>
            <tr>
                <th>Land Price</th>
                <td class="t-financial">$${formatCurrency(s.landPrice)}</td>
            </tr>
            <tr>
                <th>Margin</th>
                <td class="t-financial">$${formatCurrency(s.margin)}</td>
            </tr>
            <tr>
                <th>N.O.I (?)</th>
                <td class="t-financial">$${formatCurrency(s.noi)}</td>
            </tr>
            <tr>
                <th>N.O.I per apartment (?)</th>
                <td class="t-financial">$${formatCurrency(s.noiPerApt)}</td>
            </tr>
            <tr>
                <th>N.O.I prop of EGI (?)</th>
                <td class="t-financial">$${formatCurrency(s.noiPropOfEGI)}</td>
            </tr>
            <tr>
                <th>Parking Price</th>
                <td class="t-financial">$${formatCurrency(s.parkingPrice)}</td>
            </tr>
            <tr>
                <th>Return on Cost</th>
                <td>${s.returnOnCost}</td>
            </tr>
            <tr>
                <th>Soft Costs</th>
                <td class="t-financial">$${formatCurrency(s.softCosts)}</td>
            </tr>
            <tr>
                <th>Surplus</th>
                <td class="t-financial">$${formatCurrency(s.surplus)}</td>
            </tr>
            <tr>
                <th>tdcPerGSF (?)</th>
                <td class="t-financial">$${formatCurrency(s.tdcPerGSF)}</td>
            </tr>
            <tr>
                <th>tdcPerUnit (?)</th>
                <td class="t-financial">$${formatCurrency(s.tdcPerUnit)}</td>
            </tr>
            <tr>
                <th>Total Dev Cost</th>
                <td class="t-financial">$${formatCurrency(s.totalDevCost)}</td>
            </tr>
            <tr>
                <th>Total Sources</th>
                <td class="t-financial">$${formatCurrency(s.totalSources)}</td>
            </tr>

        </table>
    `);
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
        activeRenderOptions[dataLabel] = val.toString();
        let options = Object.assign({},renderOptionDefaults, activeRenderOptions);

        let outcomes = br.getOutcomes(options);
        setOutcomes(outcomes);
        br.renderScenario(options);
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

