
const throttle = function (func: Function, limit: number) {
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

const scrollTo = function (to: any, duration: number) {
    const
        element = document.scrollingElement || document.documentElement,
        start = element.scrollTop,
        change = to - start,
        startDate = +new Date(),
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        easeInOutQuad = function (t: any, b: any, c: any, d: any) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        animateScroll = function () {
            const currentDate = +new Date();
            const currentTime = currentDate - startDate;
            element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
            else {
                element.scrollTop = to;
            }
        };
        console.log(element, start, to, change);
    animateScroll();
};


const getScrollOffset = function (element: any) {
    let scrolledAmt = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
    console.log(scrolledAmt, element, element.getBoundingClientRect());
    return scrolledAmt + element.getBoundingClientRect().top;
}

const isScrolledIntoView = function (el: any) {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;

  // Partially visible elements return true:
  let isVisible = elemTop < window.innerHeight && elemBottom >= 0 && elemTop !== 0 && elemBottom !== 0;

  return isVisible;
};


const formatCurrency = function (amount: number) {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export {
    throttle,
    scrollTo,
    getScrollOffset,
    isScrolledIntoView,
    formatCurrency
};
