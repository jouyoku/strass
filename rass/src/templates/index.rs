use std::collections::HashMap;

use async_fs as fs;

use actix_web::{web, Error, HttpResponse, Result};

use sailfish::TemplateOnce;

use crate::json_file;
use crate::query;
use sqlx::Database;
use sqlx::MySql;
use sqlx::Row;

use crate::util;
use serde::{Deserialize, Serialize};
use serde_json::json;

fn get_ss_image_url() -> String {
    //let server_url: String = "https://www.msbt.com.tw".to_owned();
    let server_url: String = "".to_owned();
    serde_json::to_string(&json!({
        "img": server_url.clone() + "/img",
        "picture": {
            "src": server_url.clone() + "/picture/src",
            "webp": server_url.clone() + "/picture/webp",
            "jp2": server_url.clone() + "/picture/jp2",
            "xs": server_url.clone() + "/picture/xs/src",
            "xsWebp": server_url.clone() + "/picture/xs/webp",
            "xsJp2": server_url.clone() + "/picture/xs/jp2",
        },
        "i18n": "zh-TW",
    }))
    .unwrap()
}

async fn get_ss_header_data(
    file_page_article: &json_file::PageArticle,
    file_inspiration_data: &serde_json::Value,
    db_product_categories: &Vec<<MySql as Database>::Row>,
    db_products: &Vec<<MySql as Database>::Row>,
    db_color_sets: &Vec<<MySql as Database>::Row>,
    db_functions: &Vec<<MySql as Database>::Row>,
) -> String {
    let db_faqs = query::faqs().await;
    let db_banners = query::banners().await;
    let db_languages = query::languages().await;

    let mut product_categories = json!([]);
    for category in db_product_categories.iter() {
        let cid = category.get::<i32, _>("cid");
        let href = "https://www.msbt.com.tw/product/".to_owned()
            + &category.get::<String, _>("productCategoryUrlName");
        let mut products = json!([]);
        for product in db_products.iter() {
            if cid != product.get::<i32, _>("productCategory") {
                continue;
            }
            let product = json!({
                "title": util::i18n_str("zh-TW", product.get::<String, _>("productLangTitle")),
                "href": href.clone() + "/" + &product.get::<String, _>("productUrlName"),
            });
            products.as_array_mut().unwrap().push(product);
        }
        let product_category = json!({
            "title": util::i18n_str("zh-TW", category.get::<String, _>("productCategoryLangTitle")),
            "href": href,
            "img": "/productCategory/".to_owned() + &category.get::<String, _>("productCategoryUrlName") + "/photo-megamenu-product_x720.png",
            "items": products,
        });
        product_categories
            .as_array_mut()
            .unwrap()
            .push(product_category);
    }

    let mut spaces = json!([]);
    for (key, space) in file_inspiration_data["spaceList"].as_object().unwrap() {
        let title = "megamenu_inspiration_space_".to_owned() + &key.to_string();
        let href = match space.get("url") {
            None => "/inspiration/".to_owned() + &key.to_string(),
            Some(url) => "/".to_owned() + url.as_str().unwrap(),
        };

        spaces.as_array_mut().unwrap().push(json!({
            "title": file_page_article.str(&title),
            "href": href,
        }));
    }

    let mut colors = json!([]);
    for color in db_color_sets.iter() {
        let title = color.get::<String, _>("colorSetLangTitle");
        let href = "/color/".to_owned() + &color.get::<String, _>("colorSetUrlName");
        colors.as_array_mut().unwrap().push(json!({
            "title": util::i18n_str("zh-TW", title),
            "href": href,
        }));
    }

    let mut functions = json!([]);
    for function in db_functions.iter() {
        let title = function.get::<String, _>("functionLangTitle");
        let href = "/function/".to_owned() + &function.get::<String, _>("functionUrlName");
        functions.as_array_mut().unwrap().push(json!({
            "title": util::i18n_str("zh-TW", title),
            "href": href,
        }));
    }

    let mut styles = json!([]);
    for (key, style) in file_inspiration_data["styleList"].as_object().unwrap() {
        let title = "megamenu_inspiration_style_".to_owned() + &key.to_string();
        let href = match style.get("url") {
            None => "/inspiration/".to_owned() + &key.to_string(),
            Some(url) => "/".to_owned() + url.as_str().unwrap(),
        };

        styles.as_array_mut().unwrap().push(json!({
            "title": file_page_article.str(&title),
            "href": href,
        }));
    }

    let inspirations = json!([
        {
            "title": file_page_article.str("megamenu_inspiration_space"),
            "href": "/space",
            "img": "/megamenu/megamenu.inspiration.space_x360.png",
            "items": spaces,
        },
        {
            "title": file_page_article.str("megamenu_inspiration_color"),
            "href": "/color",
            "img": "/megamenu/megamenu.inspiration.color_x360.png",
            "items": colors,
        },
        {
            "title": file_page_article.str("megamenu_inspiration_function"),
            "href": "/function",
            "img": "/megamenu/megamenu.inspiration.function_x360.png",
            "items": functions,
        },
        {
            "title": file_page_article.str("megamenu_inspiration_style"),
            "href": "/style",
            "img": "/megamenu/megamenu.inspiration.style_x360.png",
            "items": styles,
        },
        {
            "title": file_page_article.str("megamenu_inspiration_portfolio"),
            "href": "/blog/?s=案例",
            "img": "/megamenu/megamenu.inspiration.portfolio_x360.png",
        },
        {
            "title": file_page_article.str("megamenu_inspiration_ig"),
            "href": "/ig",
            "img": "/megamenu/megamenu.inspiration.ig_x360.png",
        },
    ]);

    let mut faqs = json!([]);
    let mut faq_cids = Vec::new();
    for faq in db_faqs.iter() {
        let tmp = util::i18n_str("zh-TW", faq.get("FAQLangTitle"));
        if tmp.trim().len() <= 0 {
            continue;
        }
        let cid = faq.get::<i32, _>("cid");
        if faq_cids.contains(&cid) {
            continue;
        }

        faq_cids.push(cid);
        let title = util::i18n_str("zh-TW", faq.get("FAQCategoryLangTitle"));
        let href = "/faq#faq-category_".to_owned() + &title;
        faqs.as_array_mut().unwrap().push(json!({
            "title": title,
            "href": href,
            "img": "/megamenu/megamenu.how-to-buy_x720.png",
        }));
    }

    let mut languages = json!([]);
    for language in db_languages.iter() {
        let title = language.get::<String, _>("languageShowName");
        let href = "https://".to_owned() + language.get("langMainDomain") + "/";
        languages.as_array_mut().unwrap().push(json!({
            "title": title,
            "href": href,
        }));
    }

    let shopping_cart = json!({
        "inquiryAmount": file_page_article.str("navbar-cart_inquiry_amount"),
        "swatchesAmount": file_page_article.str("navbar-cart_swatches_amount"),
        "swatchesTitle": file_page_article.str("navbar-cart_swatches_title"),
        "keepShopping": file_page_article.str("navbar-cart_shopping"),
        "checkout": file_page_article.str("navbar-cart_checkout"),
    });

    let banners = json!([]);
    for _banner in db_banners.iter() {}

    let ss_header_data = json!({
        "logoMd": {
            "src": "/msbt-logo.png",
            "alt": file_page_article.str("global_logoImageAlt"),
        },
        "logoSm": {
            "src": "/msbt-logo-xs.png",
            "alt": file_page_article.str("global_logoImageAlt"),
        },
        "navbarMd": [
            [
                {
                    "href": "/goodvalue",
                    "title": file_page_article.str("navbar-menuItem_1"),
                },
                {
                    "href": "/diy",
                    "title": file_page_article.str("navbar-menuItem_2"),
                },
            ],
            [
                {
                    "href": "/product",
                    "title": file_page_article.str("navbar-menuItem_3"),
                },
                {
                    "href": "/inquiry",
                    "title": file_page_article.str("navbar-menuItem_4"),
                },
            ],
            [
                {
                    "href": "/inspiration",
                    "title": file_page_article.str("navbar-menuItem_5"),
                },
                {
                    "href": "/gallery",
                    "title": file_page_article.str("navbar-menuItem_6"),
                },
            ],
            [
                {
                    "href": "/faq",
                    "title": file_page_article.str("navbar-menuItem_7"),
                },
                {
                    "href": "/contact",
                    "title": file_page_article.str("navbar-menuItem_8"),
                },
            ],
        ],
        "megamenu1Items": [
            {
                "title": file_page_article.str("megamenu_goodvalue_readymade"),
                "href": "/store/readymade",
                "img": "/megamenu/megamenu.goodvalue.readymade_x720.png"
            },
            {
                "title": file_page_article.str("megamenu_goodvalue_promo-offer"),
                "href": "/blog/category/promo-offer",
                "img": "/megamenu/megamenu.goodvalue.promo-offer_x720.png"
            },
            {
                "title": file_page_article.str("megamenu_goodvalue_clearance"),
                "href": "/store/clearance",
                "img": "/megamenu/megamenu.goodvalue.clearance_x720.png"
            },
            {
                "title": file_page_article.str("megamenu_goodvalue_inquiry"),
                "href": "/inquiry",
                "img": "/megamenu/megamenu.goodvalue.inquiry_x720.png"
            },
        ],
        "megamenu2Items": product_categories,
        "megamenu3Items": inspirations,
        "megamenu4Items": faqs,
        "languages": languages,
        "shoppingCart": shopping_cart,
        "navbarSm": [
            {
                "slidedown": true,
                "title": file_page_article.str("navbar-menuItem_1"),
                "href": "/goodvalue",
                "items": [
                    {
                        "title": file_page_article.str("navbar-mobile-menuItem_01-02"),
                        "href": "/store/readymade",
                    },
                    {
                        "title": file_page_article.str("navbar-mobile-menuItem_01-01"),
                        "href": "https://www.msbt.com.tw/blog/category/promo-offer/",
                    },
                    {
                        "title": file_page_article.str("navbar-mobile-menuItem_01-03"),
                        "href": "/store/clearance",
                    },
                ],
            },
            {
                "slidedown": true,
                "title": file_page_article.str("navbar-menuItem_3"),
                "href": "/product",
                "items": product_categories,
            },
            {
                "title": file_page_article.str("navbar-menuItem_5"),
                "href": "/inspiration",
                "items": inspirations,
            },
            {
                "title": file_page_article.str("navbar-menuItem_7"),
                "href": "/faq",
            },
            {
                "title": file_page_article.str("navbar-menuItem_2"),
                "href": "/diy",
            },
            {
                "title": file_page_article.str("navbar-menuItem_4"),
                "href": "/inquiry",
            },
            {
                "title": file_page_article.str("navbar-menuItem_6"),
                "href": "/gallery",
            },
            {
                "title": file_page_article.str("navbar-menuItem_8"),
                "href": "/contact",
            },
        ],
        "banners": banners,
        "breadcrumbs": [],
    });

    serde_json::to_string(&ss_header_data).unwrap()
}

async fn get_ss_index_data(
    file_page_article: &json_file::PageArticle,
    file_inspiration_data: &serde_json::Value,
    db_color_sets: &Vec<<MySql as Database>::Row>,
    db_functions: &Vec<<MySql as Database>::Row>,
) -> String {
    let db_slides = query::slides().await;

    let mut slide_images = json!([]);
    for slide in db_slides.iter() {
        slide_images.as_array_mut()
            .unwrap()
            .push(json!({
                "href": slide.get::<String, _>("slideUrl"),
                "src": "/slider/".to_owned() + &slide.get::<i32, _>("sid").to_string() + "/photo-slide_1140.png",
                "alt": slide.get::<String, _>("slideName"),
            }));
    }

    let mut block_banners_images = json!([]);
    for i in 1..5 {
        let href = file_page_article
            .str(&("index-banners_image".to_owned() + &i.to_string() + "TextLink"));
        let text =
            file_page_article.str(&("index-banners_image".to_owned() + &i.to_string() + "Text"));
        block_banners_images.as_array_mut()
            .unwrap()
            .push(json!({
                "img": {
                    "href": href,
                    "src": file_page_article.str(&("index-banners_image".to_owned() + &i.to_string() + "Link")).replace("https://www.msbt.com.tw/webData/index-banners", "/index/banners"),
                    "alt": text,
                },
                "title": {
                    "href": href,
                    "text": text,
                }
            }));
    }

    let mut block_all_rooms_images = json!([]);
    for room in vec!["livingRoom", "bathRoom", "bedroom", "partition"].iter() {
        /*
        let tmp = file_inspiration_data["spaceList"]
            .as_object()
            .unwrap()
            .get(&room.to_string())
            .unwrap();
        let href = match tmp.get("url") {
            None => "/inspiration/".to_owned() + &room.to_string(),
            Some(url) => {
                let url_str = url.as_str().unwrap().to_string();
                if url_str.len() == 0 {
                    return "/inspiration/".to_owned() + &room.to_string();
                }
                url_str
            }
        };
        */
        let href = "/inspiration/".to_owned() + &room.to_string();

        let text = file_page_article.str(&("index-space_".to_owned() + &room.to_string()));
        block_all_rooms_images.as_array_mut().unwrap().push(json!({
            "img": {
                "href": href,
                "src": "/index/space/index-space-".to_owned() + room + "_350.png",
                "alt": text,
            },
            "title": {
                "href": href,
                "text": text,
            }
        }));
    }

    let mut color_explorer_items = json!([]);
    for color in db_color_sets.iter() {
        let href = "/color/".to_owned() + &color.get::<String, _>("colorSetUrlName");
        let text = util::i18n_str("zh-TW", color.get::<String, _>("colorSetLangTitle"));
        color_explorer_items.as_array_mut()
            .unwrap()
            .push(json!({
                "img": {
                    "href": href,
                    "src": "/index/colorSet/".to_owned() + &color.get::<String, _>("colorSetUrlName") + "/photo-square_100x100.png",
                    "alt": text,
                },
                "title": {
                    "href": href,
                    "text": text,
                },
                "color": {
                    "href": href,
                    "code": color.get::<String, _>("colorCode"),
                    "title": text,
                },
            }));
    }

    let mut features_items = json!([]);
    for function in db_functions.iter() {
        let href = "/function/".to_owned() + &function.get::<String, _>("functionUrlName");
        let text = util::i18n_str("zh-TW", function.get::<String, _>("functionLangTitle"));
        features_items.as_array_mut()
            .unwrap()
            .push(json!({
                "img": {
                    "href": href,
                    "src": "/index/function/".to_owned() + &function.get::<String, _>("functionUrlName") + "/photo-icon_100.png",
                    "alt": text,
                },
                "title": {
                    "href": href,
                    "text": text,
                },
            }));
    }

    let ss_index_data = json!({
        "slideImages": slide_images,
        "blockBanners": {
            "title": file_page_article.str("index-banners_title"),
            "subTitle": file_page_article.str("index-banners_subTitle"),
            "article": file_page_article.str("index-banners_article"),
            "btnText": file_page_article.str("index-banners_learnMore"),
            "btnHref": file_page_article.str("index-banners_learnMoreLink"),
            "images": block_banners_images,
        },
        "msbtStyle": {
            "title": file_page_article.str("index-product_title"),
            "line1": file_page_article.str("index-product_line1"),
            "line1H1": file_page_article.str("index-product_line1-h1"),
            "line2H2": file_page_article.str("index-product_line2-h2"),
            "line2H22": file_page_article.str("index-product_line2-h2-2"),
            "line2": file_page_article.str("index-product_line2"),
            "line22": file_page_article.str("index-product_line2-2"),
            "btnText": file_page_article.str("index-product_shopNow"),
            "btnHref": "/product",
        },
        "blockAllRooms": {
          "title": file_page_article.str("index-interiorDesign_title"),
          "subTitle": file_page_article.str("index-interiorDesign_subTitle"),
          "article": file_page_article.str("index-interiorDesign_article"),
          "btnText": file_page_article.str("index-interiorDesign_learnMore"),
          "btnHref": "/space",
          "images": block_all_rooms_images,
        },
        "colorExplorer": {
          "title": file_page_article.str("index-curtainColors_title"),
          "subTitle": file_page_article.str("index-curtainColors_subTitle"),
          "article": file_page_article.str("index-curtainColors_article"),
          "articleH2": file_page_article.str("index-curtainColors_article_h2"),
          "btnText": file_page_article.str("index-curtainColors_learnMore"),
          "btnHref": "/color",
          "items": color_explorer_items,
        },
        "features": {
          "title": file_page_article.str("index-functionSelect_title"),
          "subTitle": file_page_article.str("index-functionSelect_subTitle"),
          "article": file_page_article.str("index-functionSelect_article"),
          "articleH2": file_page_article.str("index-functionSelect_article_h2"),
          "btnText": file_page_article.str("index-functionSelect_learnMore"),
          "btnHref": "/function",
          "items": features_items,
        },
        "casePortfolio": {
          "href": "/blog",
          "title": file_page_article.str("index-blogCase_title"),
          "subTitle": file_page_article.str("index-blogCase_subTitle"),
          "article": file_page_article.str("index-blogCase_article"),
          "btnText": file_page_article.str("index-blogCase_shopNow"),
          "btnHref": "/blog",
          "img": {
            "href": "/blog",
            "src": "/index/portfolio_780.png",
            "alt": file_page_article.str("index-blogCase_subTitle"),
          },
        },
        "freeServices": {
          "href": "/inquiry",
          "title": file_page_article.str("index-service_title"),
          "subTitle": file_page_article.str("index-service_subTitle"),
          "article": file_page_article.str("index-service_freeSwatches-article"),
          "btnText": file_page_article.str("index-service_freeSwatches"),
          "btnHref": "/inquiry",
          "img": {
            "href": "/inquiry",
            "src": "/index/service_780.png",
            "alt": file_page_article.str("index-service_freeSwatches"),
          },
        },
        "getReady": {
          "title": file_page_article.str("index-getReady_title"),
          "subTitle": file_page_article.str("index-getReady_subTitle"),
          "article": file_page_article.str("index-getReady_article"),
          "installation": {
            "subject": file_page_article.str("index-getReady_installation-subject"),
            "article": file_page_article.str("index-getReady_installation-article"),
            "btnText": file_page_article.str("index-getReady_installation-DIY"),
            "btnHref": "/diy",
            "img": {
              "href": "/diy",
              "src": "/index/getReady/install.png",
              "alt": file_page_article.str("index-getReady_installation-DIY"),
            },
          },
          "style": {
            "subject": file_page_article.str("index-getReady_style-subject"),
            "article": file_page_article.str("index-getReady_style-article"),
            "btnText": file_page_article.str("index-getReady_style-idea"),
            "btnHref": "/product",
            "img": {
              "href": "/product",
              "src": "/index/getReady/style.png",
              "alt": file_page_article.str("index-getReady_style-idea"),
            },
          },
          "start": {
            "step1": file_page_article.str("index-getReady_start-step1"),
            "step2": file_page_article.str("index-getReady_start-step2"),
            "step3": file_page_article.str("index-getReady_start-step3"),
            "img": {
              "href": "/faq",
              "src": "/index/getReady/start.png",
              "alt": "faq",
            },
          },
        },
    });
    serde_json::to_string(&ss_index_data).unwrap()
}

async fn get_ss_footer_data(file_page_article: &json_file::PageArticle) -> String {
    let mut quick = json!([]);
    let mut contact = json!([]);
    for i in 1..5 {
        let mut qrow = json!([]);
        for j in 1..5 {
            let id = "footer-quick_section".to_owned() + &i.to_string() + "-" + &j.to_string();
            qrow.as_array_mut()
                .unwrap()
                .push(json!(file_page_article.str(&id)));
        }
        quick.as_array_mut().unwrap().push(qrow);

        let mut crow = json!([]);
        for j in 1..4 {
            let id = "footer-contact_section".to_owned() + &i.to_string() + "-" + &j.to_string();
            crow.as_array_mut()
                .unwrap()
                .push(json!(file_page_article.str(&id)));
        }
        contact.as_array_mut().unwrap().push(crow);
    }

    let ss_footer_data = json!({
        "browsedProducts": {
            "title": file_page_article.str("footer-product-history_productHistory"),
            "items": [],
        },
        "followUs": file_page_article.str("footer-followus"),
        "copyright": file_page_article.str("footer-copyright"),
        "quick": quick,
        "contact": contact,
    });
    serde_json::to_string(&ss_footer_data).unwrap()
}

#[derive(TemplateOnce, Serialize, Deserialize)] // automatically implement `TemplateOnce` trait
#[template(path = "index.html")] // specify the path to template
struct IndexTemplate<
    'ss_lang,
    'ss_image_url,
    'ss_header_data,
    'ss_index_data,
    'ss_footer_data,
    'ss_title,
    'ss_keywords,
    'ss_description,
    'ss_url,
    'ss_og_locale,
    'ss_og_site_name,
    'ss_og_title,
    'ss_og_url,
    'ss_og_image,
    'ss_og_description,
    'ss_canonical,
    'ss_alternate_zh_tw,
    'ss_alternate_en,
> {
    ss_lang: &'ss_lang str,
    ss_image_url: &'ss_image_url str,
    ss_header_data: &'ss_header_data str,
    ss_index_data: &'ss_index_data str,
    ss_footer_data: &'ss_footer_data str,
    ss_title: &'ss_title str,
    ss_keywords: &'ss_keywords str,
    ss_description: &'ss_description str,
    ss_url: &'ss_url str,
    ss_og_locale: &'ss_og_locale str,
    ss_og_site_name: &'ss_og_site_name str,
    ss_og_title: &'ss_og_title str,
    ss_og_url: &'ss_og_url str,
    ss_og_image: &'ss_og_image str,
    ss_og_description: &'ss_og_description str,
    ss_canonical: &'ss_canonical str,
    ss_alternate_zh_tw: &'ss_alternate_zh_tw str,
    ss_alternate_en: &'ss_alternate_en str,
}

async fn gen_template_string(path: &str) -> serde_json::Value {
    let file_page_article = json_file::PageArticle::new("zh-TW").await;
    let file_inspiration_data = json_file::inspiration_data().await;

    let db_product_price_tables = query::product_price_tables().await;
    let db_product_categories = query::product_categories().await;
    let db_products = query::products().await;
    let db_product_skus = query::product_skus().await;

    let db_color_sets = query::color_sets().await;
    let db_functions = query::functions().await;

    let mut ss_title = "Index Title".to_owned();
    let mut ss_description = "Index Description".to_owned();
    let mut ss_og_title = ss_title.clone();
    let mut ss_og_description = ss_description.clone();
    let db_seo_tkd_targets = query::seo_tkd_targets("https://www.msbt.com.tw/").await;
    if db_seo_tkd_targets.len() == 1 {
        ss_title = db_seo_tkd_targets[0].get::<String, _>("targetTitle");
        ss_description = db_seo_tkd_targets[0].get::<String, _>("targetDescription");
        ss_og_title = db_seo_tkd_targets[0].get::<String, _>("targetFBTitle");
        ss_og_description = db_seo_tkd_targets[0].get::<String, _>("targetFBDescription");
        if ss_og_title.len() == 0 {
            ss_og_title = ss_title.clone();
        }
        if ss_og_description.len() == 0 {
            ss_og_description = ss_description.clone();
        }
    }

    let index_json = json!({
        "ss_lang": "zh-TW",
        "ss_image_url": &get_ss_image_url(),
        "ss_header_data": &get_ss_header_data(
            &file_page_article,
            &file_inspiration_data,
            &db_product_categories,
            &db_products,
            &db_color_sets,
            &db_functions,
        )
        .await,
        "ss_index_data": &get_ss_index_data(
            &file_page_article,
            &file_inspiration_data,
            &db_color_sets,
            &db_functions,
        )
        .await,
        "ss_footer_data": &get_ss_footer_data(&file_page_article).await,
        "ss_title": &ss_title,
        "ss_keywords": "",
        "ss_description": &ss_description,
        "ss_url": "https://www.msbt.com.tw/",
        "ss_og_locale": "zh_TW",
        "ss_og_site_name": &file_page_article.str("global_pageTKD_Title"),
        "ss_og_title": &ss_og_title,
        "ss_og_url": "https://www.msbt.com.tw/",
        "ss_og_image": "https://www.msbt.com.tw/imgs/fb-share-index.jpg",
        "ss_og_description": &ss_og_description,
        "ss_canonical": "https://www.msbt.com.tw/",
        "ss_alternate_zh_tw": "https://www.msbt.com.tw/",
        "ss_alternate_en": "https://www.msbtblinds.com",
    });

    fs::write(path, index_json.to_string()).await.unwrap();
    index_json
}

pub async fn index(_query: web::Query<HashMap<String, String>>) -> Result<HttpResponse, Error> {
    let path = "index.json";
    //*
    let index_json: serde_json::Value = match fs::read_to_string(path).await {
        Ok(data) => serde_json::from_str(&data).unwrap(),
        Err(_) => gen_template_string(path.clone()).await,
    };
    //*/
    //let index_json: serde_json::Value = gen_template_string(path.clone()).await;

    let index_template = IndexTemplate {
        ss_lang: index_json["ss_lang"].as_str().unwrap(),
        ss_image_url: index_json["ss_image_url"].as_str().unwrap(),
        ss_header_data: index_json["ss_header_data"].as_str().unwrap(),
        ss_index_data: index_json["ss_index_data"].as_str().unwrap(),
        ss_footer_data: index_json["ss_footer_data"].as_str().unwrap(),
        ss_title: index_json["ss_title"].as_str().unwrap(),
        ss_keywords: index_json["ss_keywords"].as_str().unwrap(),
        ss_description: index_json["ss_description"].as_str().unwrap(),
        ss_url: index_json["ss_url"].as_str().unwrap(),
        ss_og_locale: index_json["ss_og_locale"].as_str().unwrap(),
        ss_og_site_name: index_json["ss_og_site_name"].as_str().unwrap(),
        ss_og_title: index_json["ss_og_title"].as_str().unwrap(),
        ss_og_url: index_json["ss_og_url"].as_str().unwrap(),
        ss_og_image: index_json["ss_og_image"].as_str().unwrap(),
        ss_og_description: index_json["ss_og_description"].as_str().unwrap(),
        ss_canonical: index_json["ss_canonical"].as_str().unwrap(),
        ss_alternate_zh_tw: index_json["ss_alternate_zh_tw"].as_str().unwrap(),
        ss_alternate_en: index_json["ss_alternate_en"].as_str().unwrap(),
    };

    Ok(HttpResponse::Ok()
        .content_type("text/html")
        .body(index_template.render_once().unwrap()))
}
