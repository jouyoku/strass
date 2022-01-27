import { Component, createSignal, For, onMount } from "solid-js";
import { render } from "solid-js/web";
import { Img, Picture } from "../common/image/image.tsx";
import "../common.css";
import "./index.css";

import { FaSolidPlay } from 'solid-icons/fa'

import { animate, bounceOut } from 'popmotion';
import styler from 'stylefire';

import "./dev.js";

const Slide: Component = (props) => {
  const [sliding, setSliding] = createSignal(false)
  const images = props.images;

  onMount(() => {
    let tmp = document.getElementsByClassName('m2-slide');
    if (tmp.length == 0) {
      return;
    }

    let slideStyler = styler(tmp[0])

    animate({
      from: 0,
      to: 1,
      duration: 700,
      ease: bounceOut,
      onUpdate: scaleY => {
        slideStyler.set({
          scaleY: scaleY,
          originY: 0
        })
      }
    })

  });

  let timerId;

  function stopSlide() {
    clearInterval(timerId);
  }

  function startSlide() {
    timerId = setInterval(nextSlide, 5000);
  }

  startSlide();

  function transitionEnd() {
    setSliding(false);
  }

  let slide0 = 0;
  let slide1 = 0;
  let slideRight = false;
  function doSlide() {
    if (slide0 == slide1) {
      return;
    }

    let lis = document.querySelectorAll('.m2-slide-li')
    let imgs = document.querySelectorAll('.m2-slide-img')

    if (slideRight) {
      lis[slide0].classList.remove('m2-bg-white');
      imgs[slide0].classList.remove('m2-translate-x-0', 'm2-hidden');
      imgs[slide0].classList.add('m2--translate-x-full');

      lis[slide1].classList.add('m2-bg-white');
      imgs[slide1].classList.remove('m2-translate-x-full', 'm2-hidden');
      imgs[slide1].classList.add('m2-translate-x-0');
      imgs[slide1].addEventListener("transitionend", transitionEnd);
    } else {
      lis[slide0].classList.remove('m2-bg-white');
      imgs[slide0].classList.remove('m2-translate-x-0', 'm2-hidden');
      imgs[slide0].classList.add('m2-translate-x-full');

      lis[slide1].classList.add('m2-bg-white');
      imgs[slide1].classList.remove('m2--translate-x-full', 'm2-hidden');
      imgs[slide1].classList.add('m2-translate-x-0');
      imgs[slide1].addEventListener("transitionend", transitionEnd);
    }
    slide0 = slide1;
  }

  function doSlide0() {
    let imgs = document.querySelectorAll('.m2-slide-img')
    imgs[slide1].classList.remove('m2-hidden');

    setTimeout(doSlide, 30);
  }

  function doSlide1() {
    let imgs = document.querySelectorAll('.m2-slide-img')

    slide1 = (slide1 + imgs.length) % imgs.length;

    if (slideRight) {
      imgs[slide1].classList.remove('m2--translate-x-full', 'm2-translate-x-0');
      imgs[slide1].classList.add('m2-translate-x-full', 'm2-hidden');
    } else {
      imgs[slide1].classList.remove('m2-translate-x-full', 'm2-translate-x-0');
      imgs[slide1].classList.add('m2--translate-x-full', 'm2-hidden');
    }
  }

  function slideTo(index) {
    if (index == slide0) {
      return;
    }

    if (sliding()) {
      return;
    }

    setSliding(true);

    slideRight = false;
    if (index > slide0) {
      slideRight = true;
    }

    slide1 = index;

    doSlide1()

    setTimeout(doSlide0, 30);
  }

  function nextSlide() {
    if (sliding()) {
      return;
    }

    setSliding(true);

    slideRight = true;
    slide1 = slide0 + 1;

    doSlide1()

    setTimeout(doSlide0, 30);
  }

  function previousSlide() {
    if (sliding()) {
      return;
    }

    setSliding(true);

    slideRight = false;
    slide1 = slide0 - 1;

    doSlide1()

    setTimeout(doSlide0, 30);
  }

  return (
    <div class="m2-container m2-overflow-hidden" onMouseOver={stopSlide} onMouseLeave={startSlide}>
      <div class="m2-slide">
        <Picture class="m2-w-full" src={images[0].src} alt={images[0].alt} loading="eager" i18n={true} />
        <For each={images}>{(image, i) =>
          <div class="m2-common-width m2-slide-img" classList={{ 'm2-translate-x-0': (i() === 0), 'm2--translate-x-full': (i() === (images.length - 1)), 'm2-translate-x-full': ((i() !== 0) && (i() !== (images.length - 1))) }}>
            <a href={image.href}>
              <Picture class="m2-w-full" src={image.src} alt={image.alt} loading="lazy" i18n={true} />
            </a>
          </div>
        }</For>
        <div class="m2-slide-button-left m2-absolute m2-inset-y-0 m2-right-0 m2-w-1/6 m2-text-4xl m2-text-white m2-text-center m2-opacity-50 m2-cursor-pointer hover:m2-opacity-100 m2-bg-gradient-to-r m2-from-transparent m2-to-gray-500" onClick={nextSlide}>
          <div class="m2-absolute m2-top-1/2 m2-left-1/2">
            &#x276F;
          </div>
        </div>
        <div class="m2-slide-button-right m2-absolute m2-inset-y-0 m2-left-0 m2-w-1/6 m2-text-4xl m2-text-white m2-text-center m2-opacity-50 m2-cursor-pointer hover:m2-opacity-100 m2-bg-gradient-to-l m2-from-transparent m2-to-gray-500" onClick={previousSlide}>
          <div class="m2-absolute m2-top-1/2 m2-left-1/2">
            &#x276E;
          </div>
        </div>
        <ol class="m2-absolute m2-bottom-4 m2-w-full m2-text-center">
          <For each={images}>{(image, i) =>
            <li class="m2-slide-li" classList={{ 'm2-bg-white': i() === 0 }} onClick={[slideTo, i()]} />
          }</For>
        </ol>
      </div>
    </div>
  );
}

const Block4Images: Component = (props) => {
  return (
    <div class="m2-container m2-py-8">
      <div class="m2-flex m2-flex-wrap">
        <div class="m2-w-full lg:m2-w-1/4 m2-flex m2-mb-2">
          <div class="m2-text-xl m2-font-black m2-text-black">
            {props.items.title}
          </div>
          <div class="m2-pl-1 m2-pt-2 m2-font-semibold m2-text-black">
            {props.items.subTitle}
          </div>
        </div>
        <div class="m2-w-full lg:m2-w-3/4 m2-leading-7 m2-hidden lg:m2-block">
          <div innerHTML={props.items.article}></div>
          <Show when={props.items.btnText.length > 0}>
            <a class="m2-flex" href={props.items.btnHref}>
              {props.items.btnText}
              <div class="m2-self-center m2-pl-2">
                <FaSolidPlay size="14px" />
              </div>
            </a>
          </Show>
        </div>
      </div>
      <div class="m2-flex m2-flex-wrap m2--mx-4">
        <For each={props.items.images}>{(item, i) =>
          <div class="m2-w-1/2 lg:m2-w-1/4 m2-px-4 m2-py-2">
            <a href={item.img.href}>
              <Picture src={item.img.src} alt={item.img.alt} noXs={true} />
            </a>
            <a class="m2-flex m2-justify-center m2-text-sm m2-mt-1" href={item.title.href}>
              {item.title.text}
              <div class="m2-self-center m2-pl-2">
                <FaSolidPlay size="14px" />
              </div>
            </a>
          </div>
        }</For>
      </div>
    </div>
  );
};

const MsbtStyle: Component = (props) => {
  return (
    <div class="m2-container m2-flex m2-flex-wrap m2-py-8">
      <div class="m2-w-full lg:m2-w-1/4 m2-text-xl m2-font-black m2-text-black m2-pb-1">
        {props.items.title}
      </div>
      <div class="m2-w-full lg:m2-w-3/4 m2-leading-7">
        <div innerHTML={props.items.line1}></div>
        <div innerHTML={props.items.line1H1}></div>
        <br />
        <div innerHTML={props.items.line2H2}></div>
        <div innerHTML={props.items.line2}></div>
        <br />
        <div innerHTML={props.items.line2H22}></div>
        <div innerHTML={props.items.line22}></div>
        <br />
        <a class="m2-flex" href={props.items.btnHref}>
          {props.items.btnText}
          <div class="m2-self-center m2-pl-2">
            <FaSolidPlay size="14px" />
          </div>
        </a>
      </div>
    </div>
  );
}

const ColorExplorer: Component = (props) => {
  return (
    <div class="m2-container m2-flex m2-flex-wrap m2-py-8">
      <div class="m2-w-full lg:m2-w-1/3">
        <div class="m2-flex m2-mb-2">
          <div class="m2-text-xl m2-font-black m2-text-black">
            {props.items.title}
          </div>
          <div class="m2-pl-1 m2-pt-2 m2-font-semibold m2-text-black">
            {props.items.subTitle}
          </div>
        </div>
        <div class="m2-leading-7 m2-hidden lg:m2-block">
          <div innerHTML={props.items.article}></div>
          <br />
          <div innerHTML={props.items.articleH2}></div>
          <a class="m2-flex" href={props.items.btnHref}>
            {props.items.btnText}
            <div class="m2-self-center m2-pl-2">
              <FaSolidPlay size="14px" />
            </div>
          </a>
        </div>
      </div>
      <div class="m2-w-full lg:m2-w-2/3 m2-hidden lg:m2-block">
        <div class="m2-container m2-flex m2-flex-wrap">
          <For each={props.items.items}>{(item, i) =>
            <div class="m2-px-4 m2-py-2 m2-text-center">
              <a href={item.img.href}>
                <Picture class="m2-mx-auto" src={item.img.src} alt={item.img.alt} loading="lazy" noXs={true} />
              </a>
              <a href={item.title.href}>
                {item.title.text}
              </a>
            </div>
          }</For>
        </div>
      </div>
      <div class="m2-w-full lg:m2-hidden m2-flex m2-flex-wrap m2-mt-8">
        <For each={props.items.items}>{(item, i) =>
          <a class="m2-w-8 m2-h-8 m2-mr-1 m2-mb-2 m2-inline-block m2-border-gray-500" classList={{ 'm2-border': item.color.code === '#ffffff' }} style={{ 'background-color': item.color.code }} href={item.color.href} title={item.color.title}>
          </a>
        }</For>
      </div>
    </div>
  );
}

const Features: Component = (props) => {
  return (
    <div class="m2-container m2-py-8">
      <div class="m2-flex m2-flex-wrap">
        <div class="m2-w-full lg:m2-w-1/3 m2-flex m2-mb-2">
          <div class="m2-text-xl m2-font-black m2-text-black">
            {props.items.title}
          </div>
          <div class="m2-pl-1 m2-pt-2 m2-font-semibold m2-text-black">
            {props.items.subTitle}
          </div>
        </div>
        <div class="m2-w-full lg:m2-w-2/3 m2-leading-7 m2-hidden lg:m2-block">
          <div innerHTML={props.items.article}></div>
          <br />
          <div innerHTML={props.items.articleH2}></div>
          <a class="m2-flex" href={props.items.btnHref}>
            {props.items.btnText}
            <div class="m2-self-center m2-pl-2">
              <FaSolidPlay size="14px" />
            </div>
          </a>
        </div>
      </div>
      <div class="m2-flex m2-overflow-x-auto m2-my-8">
        <For each={props.items.items}>{(item, i) =>
          <div class="m2-m-1 m2-text-center m2-h-40 m2-shrink-0">
            <a href={item.img.href} >
              <Picture class="m2-mx-auto" src={item.img.src} alt={item.img.alt} loading="lazy" noXs={true} />
            </a>
            <a href={item.title.href}>
              {item.title.text}
            </a>
          </div>
        }</For>
      </div>
    </div>
  );
};

const CasePortfolio: Component = (props) => {
  return (
    <div class="m2-container m2-py-8">
      <div class="m2-flex m2-flex-row-reverse m2-flex-wrap m2--mx-4" >
        <div class="m2-w-full lg:m2-w-2/3">
          <a href={props.items.img.href} >
            <Picture src={props.items.img.src} alt={props.items.img.alt} loading="lazy" />
          </a>
        </div>
        <div class="m2-w-full lg:m2-w-1/3 m2-bg-msbt-text m2-text-white m2-pt-10 m2-pb-20 m2-px-4">
          <a href={props.items.href}>
            <span class="m2-text-3xl m2-font-black">
              {props.items.title}
            </span>
            <span class="m2-pt-2 m2-text-xl m2-font-semibold">
              {props.items.subTitle}
            </span>
          </a>
          <div class="m2-my-4 m2-text-msbt-green" innerHTML={props.items.article}></div>
          <a class="m2-flex m2-font-semibold" href={props.items.btnHref}>
            {props.items.btnText}
            <div class="m2-self-center m2-pl-2">
              <FaSolidPlay size="14px" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

const FreeServices: Component = (props) => {
  return (
    <div class="m2-container m2-py-8">
      <div class="m2-flex m2-flex-wrap m2--mx-4">
        <div class="m2-w-full lg:m2-w-2/3">
          <a href={props.items.img.href} >
            <Picture src={props.items.img.src} alt={props.items.img.alt} loading="lazy" />
          </a>
        </div>
        <div class="m2-w-full lg:m2-w-1/3 m2-bg-msbt-text m2-text-white m2-pt-4 m2-pb-6 lg:m2-pb-0 m2-px-4">
          <a href={props.items.href}>
            <span class="m2-text-3xl m2-font-black">
              {props.items.title}
            </span>
            <span class="m2-pt-2 m2-text-xl m2-font-semibold">
              {props.items.subTitle}
            </span>
          </a>
          <div class="m2-my-4 m2-text-msbt-green" innerHTML={props.items.article}></div>
          <a class="m2-flex m2-font-semibold" href={props.items.btnHref}>
            {props.items.btnText}
            <div class="m2-self-center m2-pl-2">
              <FaSolidPlay size="14px" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

const GetReady: Component = (props) => {
  return (
    <div class="m2-container m2-py-8">
      <div class="m2-flex m2-flex-wrap">
        <div class="m2-w-full lg:m2-w-1/3 m2-flex m2-mb-2">
          <div class="m2-text-xl m2-font-bold m2-text-black">
            {props.items.title}
          </div>
          <div class="m2-pl-1 m2-pt-2 m2-text-sm m2-font-bold m2-text-black">
            {props.items.subTitle}
          </div>
        </div>
        <div class="m2-w-full lg:m2-w-2/3 m2-leading-7 m2-hidden lg:m2-block">
          <div innerHTML={props.items.article}></div>
        </div>
      </div>
      <div class="m2-py-4 m2-flex m2-flex-wrap">
        <div class="m2-w-full lg:m2-w-1/3 m2-pr-2 m2-pt-8">
          <div class="m2-w-full m2-flex">
            <div class="m2-w-full lg:m2-w-1/2 m2-px-2">
              <a href={props.items.style.img.href} >
                <Picture class="m2-mx-auto m2-w-full m2-max-w-200" src={props.items.style.img.src} alt={props.items.style.img.alt} loading="lazy" noXs={true} />
              </a>
            </div>
            <div class="lg:m2-w-1/2 m2-hidden lg:m2-block m2-px-2">
              <div innerHTML={props.items.style.article}></div>
            </div>
          </div>
          <div class="m2-w-full m2-py-4">
            <a class="m2-flex m2-justify-center lg:m2-justify-end" href={props.items.style.btnHref}>
              {props.items.style.btnText}
              <div class="m2-self-center m2-pl-2">
                <FaSolidPlay size="14px" />
              </div>
            </a>
          </div>
        </div>
        <div class="m2-w-full lg:m2-w-1/3 m2-px-2 m2-mb-8 lg:m2-mb-0 m2-pt-8">
          <div class="m2-w-full m2-flex">
            <div class="m2-w-full lg:m2-w-1/2 m2-px-2">
              <a href={props.items.installation.img.href} >
                <Picture class="m2-mx-auto m2-w-full m2-max-w-200" src={props.items.installation.img.src} alt={props.items.installation.img.alt} loading="lazy" noXs={true} />
              </a>
            </div>
            <div class="lg:m2-w-1/2 m2-hidden lg:m2-block m2-px-2">
              <div innerHTML={props.items.installation.article}></div>
            </div>
          </div>
          <div class="m2-w-full m2-py-4">
            <a class="m2-flex m2-justify-center lg:m2-justify-end" href={props.items.installation.btnHref}>
              {props.items.installation.btnText}
              <div class="m2-self-center m2-pl-2">
                <FaSolidPlay size="14px" />
              </div>
            </a>
          </div>
        </div>
        <div class="m2-w-full lg:m2-w-1/3 m2-pl-2 m2-relative m2-text-center">
          <a href={props.items.start.img.href} >
            <Picture class="m2-mx-auto lg:m2-max-w-300 lg:m2-w-full lg:m2-px-6" src={props.items.start.img.src} alt={props.items.start.img.alt} loading="lazy" noXs={true} />
          </a>
          <div class="m2-w-full m2-absolute m2-top-1/2 m2-pt-2" innerHTML={props.items.start.step2}></div>
        </div>
      </div>
    </div>
  );
};

//const Page: Component = () => {
function Index() {
  const data = JSON.parse(window.ss_index_data);
  return (
    <div class="m2-default-settings">
      <Slide images={data.slideImages} />
      <Block4Images items={data.blockBanners} />
      <MsbtStyle items={data.msbtStyle} />
      <Block4Images items={data.blockAllRooms} />
      <ColorExplorer items={data.colorExplorer} />
      <Features items={data.features} />
      <CasePortfolio items={data.casePortfolio} />
      <FreeServices items={data.freeServices} />
      <GetReady items={data.getReady} />
    </div>
  );
};

//export { Page };
render(Index, document.getElementById("index"));
