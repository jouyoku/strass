import { Component, Show } from "solid-js";
import "./dev.js";

const Img: Component = (props) => {
  let imageUrl = JSON.parse(window.ss_image_url)
  let attr = {
    class: false,
    alt: false,
    loading: 'auto',
  };
  if (props.class) {
    attr.class = props.class;
  }
  if (props.alt) {
    attr.alt = props.alt;
  }
  if (props.loading) {
    attr.loading = props.loading;
  }
  if (props.xs) {
    attr.xs = props.xs;
  }

  let i18n = '/common';
  if (props.i18n) {
    i18n = '/' + imageUrl.i18n;
  }
  return (
    <img class={attr.class} srcset={imageUrl.img + i18n + props.src} alt={attr.alt} loading={attr.loading} />
  );
};

const Picture: Component = (props) => {
  let imageUrl = JSON.parse(window.ss_image_url)
  let attr = {
    class: false,
    alt: false,
    loading: 'auto',
    xs: true,
  };
  if (props.class) {
    attr.class = props.class;
  }
  if (props.alt) {
    attr.alt = props.alt;
  }
  if (props.loading) {
    attr.loading = props.loading;
  }
  if (props.noXs) {
    attr.xs = !props.noXs;
  }

  let i18n = '/common';
  if (props.i18n) {
    i18n = '/' + imageUrl.i18n;
  }
  return (
    <picture>
      <Show when={attr.xs}>
        <source media="(max-width: 640px)" srcset={imageUrl.picture.xsWebp + i18n + props.src + ".webp"} type='image/webp' />
        <source media="(max-width: 640px)" srcset={imageUrl.picture.xsJp2 + i18n + props.src + ".jp2"} type='image/jp2' />
        <source media="(max-width: 640px)" srcset={imageUrl.picture.xs + i18n + props.src} />
      </Show>
      <source srcset={imageUrl.picture.webp + i18n + props.src + ".webp"} type='image/webp' />
      <source srcset={imageUrl.picture.jp2 + i18n + props.src + ".jp2"} type='image/jp2' />
      <img class={attr.class} srcset={imageUrl.picture.src + i18n + props.src} alt={attr.alt} loading={attr.loading} />
    </picture>
  );
};

export { Img, Picture };
