use std::collections::HashMap;

use actix_web::{web, Error, HttpResponse, Result};

use sailfish::TemplateOnce;

#[derive(TemplateOnce)]
#[template(path = "about/index.html")]
struct AboutTemplate<'a, 'b, 'c> {
    ss_title: &'a str,
    ss_keywords: &'b str,
    ss_description: &'c str,
}

pub async fn about(_query: web::Query<HashMap<String, String>>) -> Result<HttpResponse, Error> {
    let s = AboutTemplate {
        ss_title: "About Title",
        ss_keywords: "About Keywords",
        ss_description: "About Description",
    };
    Ok(HttpResponse::Ok()
        .content_type("text/html")
        .body(s.render_once().unwrap()))
}
