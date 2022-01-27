import { Component, createSignal, onMount, For, Show } from "solid-js";
import { render } from "solid-js/web";
import { Img, Picture } from "../common/image/image.tsx";
import "../common.css";
import "./header.css";

import { FaSolidShoppingCart } from 'solid-icons/fa';
import { FaSolidSearch } from 'solid-icons/fa'
import { FaSolidGlobeAmericas } from 'solid-icons/fa'
import { FaSolidBars } from 'solid-icons/fa'
import { FaSolidPlus } from 'solid-icons/fa'
import { FaSolidMinus } from 'solid-icons/fa'
import { FaSolidArrowCircleUp } from 'solid-icons/fa'

import { animate } from 'popmotion';
import styler from 'stylefire';

import "./dev.js";

const NavbarMdItem: Component = (props) => {
  const { href, title, setMegaMenu, megaMenuId } = props;

  function handleMouseEnter(event) {
    if (setMegaMenu) {
      setMegaMenu(megaMenuId);
    }
  }

  return (
    <div>
      <a class="m2-text-sm m2-font-normal" href={href} onMouseEnter={handleMouseEnter}>
        <span>
          {title}
        </span>
      </a>
    </div>
  );
};

const NavbarMd: Component = (props) => {
  return (
    <>
      <For each={props.items}>{(item, i) =>
        <div class="m2-navbar-md-item-pair">
          <NavbarMdItem href={item[0].href} title={item[0].title} setMegaMenu={props.setMegaMenu} megaMenuId={i()} />
          <NavbarMdItem href={item[1].href} title={item[1].title} />
        </div>
      }</For>
    </>
  );
};

const MegaMenu4: Component = (props) => {
  const [image, setImage] = createSignal(0);

  function handleMouseEnter(index, event) {
    setImage(index);
  }

  function handleMouseLeave(event) {
    props.setMegaMenu(-1);
  }

  return (
    <div class="m2-megamenu m2-common-width" onMouseLeave={handleMouseLeave}>
      <div class="m2-megamenu-col m2-col-span-3">
        <For each={props.items}>{(item, i) =>
          <div classList={{ "m2-opacity-0": image() !== i() }}>
            <Picture class="m2-megamenu-img-3/4" src={item.img} loading="lazy" alt={item.title} />
          </div>
        }</For>
      </div>
      <div class="m2-megamenu-col-list">
        <ul>
          <For each={props.items}>{(item, i) =>
            <li class="m2-leading-7" classList={{ "m2-text-msbt-primary": image() === i() }} onMouseEnter={[handleMouseEnter, i()]}>
              <NavbarMdItem href={item.href} title={item.title} />
            </li>
          }</For>
        </ul>
      </div>
    </div>
  );
};

const MegaMenu3: Component = (props) => {
  const [image, setImage] = createSignal(0);

  function handleMouseEnter(index, event) {
    setImage(index);
  }

  function handleMouseLeave(event) {
    props.setMegaMenu(-1);
  }

  return (
    <div class="m2-megamenu m2-common-width" onMouseLeave={handleMouseLeave}>
      <div class="m2-megamenu-col m2-col-span-2">
        <For each={props.items}>{(item, i) =>
          <div classList={{ "m2-opacity-0": image() !== i() }}>
            <Picture class="m2-megamenu-img-1/2" src={item.img} loading="lazy" alt={item.title} />
          </div>
        }</For>
      </div>
      <div class="m2-megamenu-col-list-dark">
        <ul>
          <For each={props.items[image()].items}>{(item, i) =>
            <li class="m2-leading-7">
              <NavbarMdItem href={item.href} title={item.title} />
            </li>
          }</For>
        </ul>
      </div>
      <div class="m2-megamenu-col-list">
        <ul>
          <For each={props.items}>{(item, i) =>
            <li class="m2-leading-7" classList={{ "m2-text-msbt-primary": image() === i() }} onMouseEnter={[handleMouseEnter, i()]}>
              <NavbarMdItem href={item.href} title={item.title} />
            </li>
          }</For>
        </ul>
      </div>
    </div>
  );
};

const MegaMenu2: Component = (props) => {
  const [image, setImage] = createSignal(0);

  function handleMouseEnter(index, event) {
    setImage(index);
  }

  function handleMouseLeave(event) {
    props.setMegaMenu(-1);
  }

  return (
    <div class="m2-megamenu m2-common-width" onMouseLeave={handleMouseLeave}>
      <div class="m2-megamenu-col-list">
        <ul>
          <For each={props.items}>{(item, i) =>
            <li class="m2-leading-7" classList={{ "m2-text-msbt-primary": image() === i() }} onMouseEnter={[handleMouseEnter, i()]}>
              <NavbarMdItem href={item.href} title={item.title} />
            </li>
          }</For>
        </ul>
      </div>
      <div class="m2-megamenu-col-list-dark">
        <ul>
          <For each={props.items[image()].items}>{(item, i) =>
            <li class="m2-leading-7">
              <NavbarMdItem href={item.href} title={item.title} />
            </li>
          }</For>
        </ul>
      </div>
      <div class="m2-megamenu-col m2-col-span-2">
        <For each={props.items}>{(item, i) =>
          <div classList={{ "m2-opacity-0": image() !== i() }}>
            <Picture class="m2-megamenu-img-1/2" src={item.img} loading="lazy" alt={item.title} />
          </div>
        }</For>
      </div>
    </div>
  );
};

const MegaMenu1: Component = (props) => {
  const [image, setImage] = createSignal(0);

  function handleMouseEnter(index, event) {
    setImage(index);
  }

  function handleMouseLeave(event) {
    props.setMegaMenu(-1);
  }

  return (
    <div class="m2-megamenu m2-common-width" onMouseLeave={handleMouseLeave}>
      <div class="m2-megamenu-col-list">
        <ul>
          <For each={props.items}>{(item, i) =>
            <li class="m2-leading-7" classList={{ "m2-text-msbt-primary": image() === i() }} onMouseEnter={[handleMouseEnter, i()]}>
              <NavbarMdItem href={item.href} title={item.title} />
            </li>
          }</For>
        </ul>
      </div>
      <div class="m2-megamenu-col m2-col-span-3">
        <For each={props.items}>{(item, i) =>
          <div classList={{ "m2-opacity-0": image() !== i() }}>
            <Picture class="m2-megamenu-img-3/4" src={item.img} loading="lazy" alt={item.title} />
          </div>
        }</For>
      </div>
    </div>
  );
};

const ShoppingCart: Component = (props) => {
  window.addEventListener("msbt2ShoppingCartChanged", onShoppingCartChanged, false);

  const [cartData, setCartData] = createSignal(window.lsCartData);
  const [inquiryList, setInquiryList] = createSignal(window.lsInquiryList);
  const [sampleList, setSampleList] = createSignal(window.lsSampleList);
  const total = () => cartData().itemList.length + inquiryList().length + sampleList().length;

  const texts = props.texts;

  function onShoppingCartChanged() {
    window.lsCartData = JSON.parse(localStorage.getItem('CartData'));
    if(!window.lsCartData) {
      window.lsCartData = {
        itemList: []
      }
    }
    setCartData(window.lsCartData);

    window.lsInquiryList = JSON.parse(localStorage.getItem('InquiryList'));
    if(!window.lsInquiryList) {
      window.lsInquiryList = []
    }
    setInquiryList(window.lsInquiryList);

    window.lsSampleList = JSON.parse(localStorage.getItem('SampleList'));
    if(!window.lsSampleList) {
      window.lsSampleList = []
    }
    setSampleList(window.lsSampleList);
  }

  onMount(() => {
    let tmp = document.getElementsByClassName('m2-shopping-cart-content');
    for (let i = 0; i < tmp.length; i++) {
      let sccStyler = styler(tmp[i])

      sccStyler.set({
        scaleY: 0,
        originY: 0
      })
    }
  });

  function toggleSlidedown() {
    let tmp = document.getElementsByClassName('m2-shopping-cart-content');
    for (let i = 0; i < tmp.length; i++) {
      let sccStyler = styler(tmp[i])

      let to = 1;
      let from = sccStyler.get('scaleY')
      if (from != 0) {
        to = 0;
      }

      animate({
        from: from,
        to: to,
        duration: 300,
        onUpdate: scaleY => {
          sccStyler.set({
            scaleY: scaleY,
            originY: 0
          })
        }
      })
    }
  }

  return (
    <>
      <button disabled={total() === 0} class="m2-self-end" aria-label="Shopping Cart" onClick={toggleSlidedown}>
        <div class="m2-hidden lg:m2-block">
          <FaSolidShoppingCart size={14} color="#000000" />
        </div>
        <div class="m2-block lg:m2-hidden">
          <FaSolidShoppingCart size={18} color="#000000" />
        </div>
      </button>
      <Show when={total() > 0}>
        <div class="m2-text-msbt-primary m2-pb-1 m2-self-end">
          {total()}
        </div>
      </Show>
      <div class="m2-shopping-cart-content">
        <div class="m2-divide-y m2-px-4 m2-items-stretch m2-w-80 m2-relative m2-bg-white m2-border m2-border-gray-500 m2-rounded">
          <For each={cartData().itemList}>{(item, i) =>
            <div class="m2-py-4 m2-flex">
              <div class="m2-w-1/2 m2-px-4">
                <img class="m2-w-full" src={'https://msbt.com.tw' + item.imageUrl} alt={item.itemName} loading="lazy" />
              </div>
              <div class="m2-w-1/2 m2-px-4">
                <div>{item.itemName}</div>
                <div><br /></div>
                <div>{texts.inquiryAmount}{item.amount}</div>
                <div class="m2-text-right">${item.price}</div>
              </div>
            </div>
          }</For>
          <For each={inquiryList()}>{(item, i) =>
            <div class="m2-py-4 m2-flex">
              <div class="m2-w-1/2 m2-px-4">
                <img class="m2-w-full" src={'https://msbt.com.tw/images/' + item.imageUrl} alt={item.itemName} loading="lazy" />
              </div>
              <div class="m2-w-1/2 m2-px-4">
                <div>{item.productShowName}</div>
                <div>{item.productSKUShowName}</div>
                <div><br /></div>
                <div>{texts.inquiryAmount}{item.amount}</div>
                <div class="m2-text-right">${item.price}</div>
              </div>
            </div>
          }</For>
          <Show when={sampleList().length > 0}>
          <div class="m2-py-4 m2-flex">
            <div class="m2-w-1/2 m2-px-4">
              <img class="m2-w-full" src="https://msbt.com.tw/images/imgs/cart-swatches_200.png" alt="Swatches" loading="lazy" />
            </div>
            <div class="m2-w-1/2 m2-px-4">
              <div>{texts.swatchesTitle}</div>
              <div><br /></div>
              <div>{texts.swatchesAmount}{sampleList().length}</div>
            </div>
          </div>
          </Show>
          <div class="m2-py-4 m2-flex">
            <a class="m2-border m2-border-black m2-w-1/2 m2-mx-4 m2-text-center m2-text-lg m2-leading-10" href="/product">
              {texts.keepShopping}
            </a>
            <a class="m2-bg-msbt-primary m2-text-white hover:m2-text-white m2-border m2-border-black m2-w-1/2 m2-mx-4 m2-text-center m2-text-lg m2-leading-10" href="/cart-step-1">
              {texts.checkout}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

const NavbarSmItem: Component = (props) => {
  const [slidedown, setSlidedown] = createSignal(!!props.item.slidedown);

  onMount(() => {
    if (props.item.slidedown) {
      return;
    }

    let tmp = document.getElementById(props['slidedown-id']);
    if (!tmp) {
      return;
    }

    let nsiStyler = styler(tmp)

    nsiStyler.set({
      scaleY: 0,
      height: 0,
      originY: 0
    })
  });

  function toggleSlidedown() {
    let tmp = document.getElementById(props['slidedown-id']);
    if (!tmp) {
      return;
    }

    let nsiStyler = styler(tmp)

    let to = 1;
    let from = nsiStyler.get('scaleY')
    if (from != 0) {
      to = 0;
    }

    nsiStyler.set({
      height: 'auto',
    });
    nsiStyler.render()
    let height = tmp.clientHeight;
    if (from == 0) {
      nsiStyler.set({
        height: 0,
      });
      nsiStyler.render()
    }

    animate({
      from: from,
      to: to,
      duration: 300,
      onUpdate: scaleY => {
        let h = (height * scaleY) + 'px';
        if (scaleY == 1) {
          h = 'auto';
        }
        nsiStyler.set({
          scaleY: scaleY,
          height: h,
          originY: 0,
        })
      }
    })

    setSlidedown(!slidedown());
  }

  return (
    <>
      <div class="m2-leading-10 m2-justify-between m2-items-center m2-flex" classList={{ 'm2-bg-msbt-menu': props.level === 0, 'm2-text-white': props.level === 0 }}>
        <div class="m2-pl-2">
          <a class="hover:m2-underline" classList={{ 'hover:m2-text-white': props.level === 0, 'hover:m2-text-msbt-primary': props.level !== 0 }} href={props.item.href}>
            {props.item.title}
          </a>
        </div>
        <Show when={props.item.items && props.item.items.length > 0}>
          <div class="m2-pr-2" classList={{ 'm2-hidden': slidedown() }} onClick={toggleSlidedown}>
            <FaSolidPlus size={16} color={props.level === 0 ? 'white' : 'black'} />
          </div>
          <div class="m2-pr-2" classList={{ 'm2-hidden': !slidedown() }} onClick={toggleSlidedown}>
            <FaSolidMinus size={16} color={props.level === 0 ? 'white' : 'black'} />
          </div>
        </Show>
      </div>
      <Show when={props.item.items && props.item.items.length > 0}>
        <div id={props['slidedown-id']} class="m2-pl-2 m2-divide-y">
          <For each={props.item.items}>{(item0, i0) =>
            <NavbarSmItem item={item0} level={props.level + 1} slidedown-id={props['slidedown-id'] + "-" + i0()} />
          }</For>
        </div>
      </Show>
    </>
  );
}

const NavbarSm: Component = (props) => {
  const [dropdown, setDropdown] = createSignal(false);

  function toggleDropdown(index) {
    setDropdown(!dropdown());
  }

  return (
    <>
      <button class="m2-block lg:m2-hidden m2-ml-1 m2-self-end m2-ml-2" aria-label="Menu" onClick={[toggleDropdown, 1]}>
        <FaSolidBars size={18} color="#000000" />
      </button>
      <div class="m2-dropdown-menu m2-w-80" classList={{ 'm2-hidden': !dropdown() }}>
        <div class="m2-bg-white m2-dropdown-content m2-divide-y">
          <For each={props.items}>{(item0, i0) =>
            <NavbarSmItem item={item0} level={0} slidedown-id={"navbar-sm-item-slidedown-" + i0()} />
          }</For>
        </div>
      </div>
    </>
  );
};

function Header() {

  onMount(() => {
    let tmp = document.getElementsByClassName('m2-megamenu');
    for (let i = 0; i < tmp.length; i++) {
      let mmStyler = styler(tmp[i])

      mmStyler.set({
        scaleY: 0,
        originY: 0
      })
    }
  });

  function setMegaMenu(index) {
    let tmp = document.getElementsByClassName('m2-megamenu');
    for (let i = 0; i < tmp.length; i++) {
      let mmStyler = styler(tmp[i])

      animate({
        to: 0,
        onUpdate: scaleY => {
          mmStyler.set({
            scaleY: scaleY,
            originY: 0
          })
        }
      })
    }

    if (!tmp[index]) {
      return;
    }

    let mmStyler = styler(tmp[index])
    animate({
      to: 1,
      duration: 300,
      onUpdate: scaleY => {
        mmStyler.set({
          scaleY: scaleY,
          originY: 0
        })
      }
    })

  }

  function toggleDropdown(index) {
    let tmp = document.querySelectorAll('.m2-dropdown')

    let show = -1
    if (tmp[index] && tmp[index].classList.contains('m2-hidden')) {
      show = index;
    }

    for (let i = 0; i < tmp.length; i++) {
      tmp[i].classList.add('m2-hidden')
    }

    if (show >= 0) {
      tmp[show].classList.remove('m2-hidden')
    }
  }

  function scrollTop() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    animate({
      from: scrollTop,
      to: 0,
      onUpdate: y => {
        window.pageYOffset = y;
        document.documentElement.scrollTop = y;
        document.body.scrollTop = y;
      }
    })
  }

  const data = JSON.parse(window.ss_header_data);

  return (
    <>
      <div class="m2-fixed m2-z-50 lg:m2-hidden m2-right-5 m2-bottom-5" onClick={scrollTop}>
        <FaSolidArrowCircleUp size={40} color="#E7E7E6" />
      </div>
      <div class="m2-container m2-relative">
        <div class="m2-justify-between m2-items-center m2-flex m2-mb-5">
          <div class="">
            <a href="/">
              <Img class="m2-logo-height m2-hidden md:m2-block lg:m2-hidden xl:m2-block" src={data.logoMd.src} alt={data.logoMd.alt} i18n={true} />
              <Img class="m2-logo-height m2-block md:m2-hidden lg:m2-block xl:m2-hidden" src={data.logoSm.src} alt={data.logoSm.alt} i18n={true} />
            </a>
          </div>
          <div class="m2-flex m2-self-end">
            <div class="m2-hidden lg:m2-block">
              <NavbarMd items={data.navbarMd} setMegaMenu={setMegaMenu} />
            </div>
            <button class="m2-self-end" aria-label="Search" onClick={[toggleDropdown, 0]}>
              <div class="m2-hidden lg:m2-block">
                <FaSolidSearch size={14} color="#000000" />
              </div>
              <div class="m2-block lg:m2-hidden">
                <FaSolidSearch size={18} color="#000000" />
              </div>
            </button>
            <div class="m2-dropdown m2-w-52 m2-hidden">
              <form action="/search">
                <div class="m2-flex m2-flex-wrap m2-bg-msbt-light m2-dropdown-content">
                  <input name="q" type="text" class="m2-shrink m2-grow m2-flex-auto m2-leading-normal m2-w-px m2-flex-1 m2-h-10 m2-border-0 m2-border-r m2-border-gray-500 m2-rounded m2-rounded-r-none m2-px-3 m2-relative" placeholder="" />
                  <button class="m2-flex m2-mx-3 m2-self-center">
                    <FaSolidSearch size={18} color="#000000" />
                  </button>
                </div>
              </form>
            </div>
            <button class="m2-mx-3 lg:m2-mx-1 xl:m2-mx-3 m2-self-end" aria-label="Language" onClick={[toggleDropdown, 1]}>
              <div class="m2-hidden lg:m2-block">
                <FaSolidGlobeAmericas size={14} color="#000000" />
              </div>
              <div class="m2-block lg:m2-hidden">
                <FaSolidGlobeAmericas size={18} color="#000000" />
              </div>
            </button>
            <div class="m2-dropdown m2-hidden">
              <div class="m2-px-4 m2-bg-white m2-dropdown-content">
                <For each={data.languages}>{(item, i) =>
                  <div class="m2-my-2 hover:m2-bg-gray-200">
                    <a href={item.href}>
                      {item.title}
                    </a>
                  </div>
                }</For>
              </div>
            </div>
            <ShoppingCart texts={data.shoppingCart} />
            <NavbarSm items={data.navbarSm} />
          </div>
        </div>
      </div>
      <Show when={data.breadcrumbs && data.breadcrumbs.length > 0}>
        <div class="m2-container m2-font-thin m2-text-sm m2-pb-4">
          <For each={data.breadcrumbs}>{(item, i) =>
            <>
            <Show when={i() > 0}>
            <span class="m2-mx-4 m2-text-gray-300 m2-text-extrabold">
              &#x276F;
            </span>
            </Show>
            <a class="hover:m2-text-msbt-primary hover:m2-underline" href={item.href}>
              {item.title}
            </a>
            </>
          }</For>
        </div>
      </Show>
      <div class="m2-container">
        <div class="m2-items-center">
          <MegaMenu1 setMegaMenu={setMegaMenu} items={data.megamenu1Items} />
          <MegaMenu2 setMegaMenu={setMegaMenu} items={data.megamenu2Items} />
          <MegaMenu3 setMegaMenu={setMegaMenu} items={data.megamenu3Items} />
          <MegaMenu4 setMegaMenu={setMegaMenu} items={data.megamenu4Items} />
        </div>
      </div>
    </>
  );
}

//export default Header;
render(Header, document.getElementById("header"));
