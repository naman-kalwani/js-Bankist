'use strict';

// selections
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////////////////
// page navigation

// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////
// scroll to button

btnScrollTo.addEventListener('click', function (e) {
  ///old school way ///
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords); // section 1
  // console.log(e.target.getBoundingClientRect()); // btnScrollTo
  // console.log('current scroll x/y', window.pageXOffset, window.pageYOffset); // current scroll
  // console.log(
  //   'height/ width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // // scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  ///////////
  // mordern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////
// tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // guard clause
  if (!clicked) return;

  // active tab

  // remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // tab
  tabsContent.forEach(c => c.classList.remove('operations__content--active')); // content

  // activate tab
  clicked.classList.add('operations__tab--active'); // tab

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // content
});

////////////////////////////////////////////////
// menu fade animation

// refactorfunction
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// }); // 1method
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////
// sticy navigation: intersetion observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.2,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // calc nav height dynamically

const stickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//////////////////////////////////////////////////
// reveal section animation
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////
// lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////
// slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlides = slides.length;

  // dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });

  // function
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide
  const nextSlide = function () {
    if (currSlide === maxSlides - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlides - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activeDot(0);
  };

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
};
slider();
//
//
//
///////////////////////////////////////////////////
///////////////////////////////////////////////////
//LECTURES
//////////////////////////////////////////////////
/*

// select ele

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('section');
console.log(allSections);

document.getElementById('#section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
console.log(document.getElementsByClassName('btn'));

// create and insert ele

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'we use cookie for improved functionality and analytics.';
message.innerHTML =
  'we use cookie for improved functionality and analytics.<button class = "btn btn--close-cookie">Got it! </button> ';
// header.prepend(message); // add ele as 1 child
header.append(message); // add ele as last child
// header.append(message.cloneNode(true)); // copy ele to diff place
// header.before(message); // before header ele as sibling ele
// header.after(message); // after header ele as sibling ele

// deleting ele
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    // message.parentElement.removeChild(message);
  });

// style //
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.backgroundColor);
console.log(message.style.height);

console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', '#FFCF07');

// ATTRIBUTES //
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

// non standard attributes
console.log(logo.designer);
console.log(logo.getAttribute('designer'));


// EVENT LISTNERS
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('hover check');
  // h1.removeEventListener('mouseenter', alertH1); // if we need to make event listner work only once
};
// 2 ways of adding event listners

h1.addEventListener('mouseenter', alertH1); // 1.
// h1.onmouseenter = alertH1; // 2. old school

// REMOVING EVENT LISTNERS

setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000); // event handler wont work after 3 sec

// we can also handle events in HTML as attribute

// event propogation

const randomNum = (max, min) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
// min ... (max-min+min)

const randomColor = () =>
  `rgb(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;
console.log(randomColor());

//
const h1 = document.querySelector('h1');
h1.addEventListener('click', function () {
  this.style.color = randomColor();
});
//

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();

  // stop propagation
  // e.stopPropagation(); bad practice
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

// DOM TRANSVERSING

const h1 = document.querySelector('h1');

// going downward : from parent toward child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'green';
h1.lastElementChild.style.color = 'olive';

// going upward : from child to parent
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// going sideways : from child to chid
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling); // nodes
console.log(h1.nextSibling); // nodes

// if we need all the siblings

console.log(h1.parentElement.children);


window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = 'hi how are u';
});

*/
