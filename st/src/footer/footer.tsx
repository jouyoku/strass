import { Component, createSignal, onMount, For, Show } from "solid-js";
import { render } from "solid-js/web";
import { Img, Picture } from "../common/image/image.tsx";
import "../common.css";
import "./footer.css";

import { FaSolidPlus } from 'solid-icons/fa'
import { FaSolidMinus } from 'solid-icons/fa'
import { FaSolidTimesCircle } from 'solid-icons/fa'

import { animate } from 'popmotion';
import styler from 'stylefire';

import "./dev.js";

const BrowsedProducts: Component = (props) => {

  const itemWidth = 128

  function scrollLeft() {
    let tmp = document.getElementsByClassName('m2-slide-panel');
    if (tmp.length == 0) {
      return;
    }

    let widthPanel = (props.items.items.length) * itemWidth

    let slideStyler = styler(tmp[0])
    let x0 = slideStyler.get('x')
    let width = slideStyler.get('width')

    let offset = Math.min(width - itemWidth, widthPanel - width + x0);

    animate({
      from: x0,
      to: x0 - offset,
      onUpdate: x => {
        slideStyler.set({
          x: x,
        })
      }
    })
  }

  function scrollRight() {
    let tmp = document.getElementsByClassName('m2-slide-panel');
    if (tmp.length == 0) {
      return;
    }

    let widthPanel = (props.items.items.length) * itemWidth

    let slideStyler = styler(tmp[0])
    let x0 = slideStyler.get('x')
    let width = slideStyler.get('width')

    let offset = Math.min(width - itemWidth, -x0);

    animate({
      from: x0,
      to: x0 + offset,
      onUpdate: x => {
        slideStyler.set({
          x: x,
        })
      }
    })
  }

  return (
    <div class="m2-container" classList={{'m2-hidden': props.items.items.length === 0}}>
      <div class="m2-text-msbt-primary">{props.items.title}</div>
      <div class="m2-my-2 m2-py-2 m2-flex m2-border">
        <div class="m2-flex m2-justify-center m2-items-center m2-w-12 m2-shrink-0 m2-cursor-pointer" onclick={scrollRight}>
          &#x276E;
        </div>
        <div class="m2-footer-slide m2-overflow-hidden">
          <div class="m2-slide-panel m2-flex m2-justify-start">
            <For each={props.items.items}>{(item, i) =>
              <div class="m2-m-2 m2-w-28 m2-text-center m2-shrink-0">
                <a href={item.img.href} >
                  <img class="m2-mx-auto" src={'https://www.msbt.com.tw' + item.img.src} alt={item.img.alt} loading="lazy" />
                </a>
                <a href={item.title.href}>
                  {item.title.text}
                </a>
              </div>
            }</For>
          </div>
        </div>
        <div class="m2-flex m2-justify-center m2-items-center m2-w-12 m2-shrink-0 m2-cursor-pointer m2-ml-auto m2-mr-0" onclick={scrollLeft}>
          &#x276F;
        </div>
      </div>
    </div>
  );
};

const Banner1: Component = (props) => {
  let sessionId = 'banner_' + props.items.session;
  let times = localStorage.getItem(sessionId);
  if(!times) {
    times = 0;
  }

  const [closed, setClosed] = createSignal(times >= 3);

  function close() {
    times++;
    localStorage.setItem(sessionId, times);
    setClosed(true)
  }

  return (
    <div classList={{ 'm2-hidden': closed() }}>
      <div class="m2-fixed m2-z-40 m2-hidden md:m2-block m2--right-2 m2-bottom-20 m2-w-52">
        <a href={props.items.md.href} >
          <img src={props.items.md.src} alt={props.items.md.alt} loading="eager" />
        </a>
        <div class="m2-absolute m2-top-1 m2-right-3" onClick={close}>
          <FaSolidTimesCircle size={24} color="#ffffff" />
        </div>
      </div>
      <div class="m2-fixed m2-z-40 md:m2-hidden m2--mx-2 m2-bottom-0">
        <a href={props.items.sm.href} >
          <img src={props.items.sm.src} alt={props.items.sm.alt} loading="eager" />
        </a>
        <div class="m2-absolute m2-top-1 m2-right-3" onClick={close}>
          <FaSolidTimesCircle size={24} color="#ffffff" />
        </div>
      </div>
    </div>
  );
};

const Banners: Component = (props) => {
  return (
    <>
      <For each={props.items}>{(item, i) =>
        <Show when={item.lid == 1}>
          <Banner1 items={item} />
        </Show>
      }</For>
    </>
  );
}

function Footer() {

  const data = JSON.parse(window.ss_footer_data);
  const imageUrl = JSON.parse(window.ss_image_url)

  return (
    <div class="m2-default-settings">
      <Banners items={data.banners} />
      <BrowsedProducts items={data.browsedProducts} />
      <Show when={imageUrl.i18n === 'zh-TW'}>
      <div class="m2-container m2-mt-16">
        <a href="/faq">
          <Picture class="m2-hidden sm:m2-block m2-w-full" src="/footer/footer-flow1.jpg" alt="default flow image" loading="lazy" i18n={true} />
          <Picture class="sm:m2-hidden m2-w-full" src="/footer/footer-flow2.jpg" alt="default flow image" loading="lazy" i18n={true} />
        </a>
      </div>
      </Show>
      <div class="m2-container m2-dark-background">
        <div class="m2-p-8 m2-bg-msbt-dark m2-text-white m2-font-light lg:m2-flex lg:m2-flex-wrap">
          <div class="m2-w-full lg:m2-w-1/2 m2-pb-8">
            <div class="m2-text-base">
              {data.followUs}
            </div>
            <div class="m2-icons m2-flex m2-flex-wrap lg:m2-pr-4">
              <a href="https://www.facebook.com/MSBTpage" target="_bland"><Img alt="FB / Facebook" src="/footer/footer-facebook.png" loading="lazy" /></a>
              <a target="_blank" href="https://www.msbt.com.tw/blog"><Img src="/footer/footer-blog.png" alt="blog" loading="lazy" /></a>
              <a href="https://www.instagram.com/msbt.living/" target="_bland"><Img alt="instagram" src="/footer/footer-instagram.png" loading="lazy" /></a>
              <a href="https://page.line.me/iny3243t" target="_bland"><Img src="/footer/footer-line.png" alt="line" loading="lazy" /></a>
              <a href="https://www.pinterest.com/MSBTliving/" target="_bland"><Img alt="pinterest" src="/footer/footer-pinterest.png" loading="lazy" /></a>
              <a href="https://www.youtube.com/user/MSBTvideo" target="_bland"><Img alt="youtube" src="/footer/footer-youtube.png" loading="lazy" /></a>
              <a href="https://tw.mall.yahoo.com/store/MSBT" target="_bland"><Img alt="yahoo" src="/footer/footer-yahoo.png" loading="lazy" /></a>
              <a href="http://www.pcstore.com.tw/msbt" target="_bland"><Img alt="pchome" src="/footer/footer-pchome.png" loading="lazy" /></a>
              <a href="<?=$_langHref?>store" target="_bland"><Img alt="msbt shop" src="/footer/footer-msbt-shop.png" loading="lazy" /></a>
            </div>
          </div>
          <div class="m2-w-full lg:m2-w-1/2">
            <div class="m2-flex m2-flex-wrap">
            <For each={data.quick}>{(row, i) =>
              <div class="m2-w-1/2 lg:m2-w-1/4 m2-pb-4">
                <For each={row}>{(item, j) =>
                  <>
                    <span class="m2-text-left m2-leading-7" innerHTML={item}></span>
                    <br />
                  </>
                }</For>
              </div>
            }</For>
            </div>
            <div class="m2-w-full m2-pb-20">
              <hr />
            </div>
          </div>
          <div class="m2-w-full lg:m2-flex m2-mt-4">
            <For each={data.contact}>{(row, i) =>
              <div class="m2-w-full lg:m2-w-1/4 m2-pb-8">
                <For each={row}>{(item, j) =>
                  <>
                    <span class="m2-text-left m2-leading-7" innerHTML={item}></span>
                    <br />
                  </>
                }</For>
              </div>
            }</For>
          </div>
          <div class="m2-w-full m2-text-center m2-pb-12" innerHTML={data.copyright}></div>
        </div>
      </div>
    </div>
  );
}

//export default Footer;
render(Footer, document.getElementById("footer"));
