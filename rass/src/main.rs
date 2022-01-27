use actix_web::{http::ContentEncoding, middleware, web, App, HttpServer};

use actix_files as fs;

//use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};

mod json_file;
mod query;
mod templates;
mod util;

async fn favicon() -> actix_web::Result<actix_files::NamedFile> {
    Ok(actix_files::NamedFile::open("./files/favicon.ico")?)
}

async fn styles() -> actix_web::Result<actix_files::NamedFile> {
    Ok(actix_files::NamedFile::open("./files/styles.css")?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
        /*
        // load ssl keys
        // to create a self-signed temporary cert for testing:
        // `openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365 -subj '/CN=localhost'`
        let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
        builder
            .set_private_key_file("key.pem", SslFiletype::PEM)
            .unwrap();
        builder.set_certificate_chain_file("cert.pem").unwrap();
        */
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    println!("Listening on: 127.0.0.1:7000, open browser and visit have a try!");
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default()) // enable logger
            .wrap(middleware::Compress::new(ContentEncoding::Gzip))
            .service(web::resource("/favicon.ico").route(web::get().to(favicon)))
            .service(web::resource("/styles.css").route(web::get().to(styles)))
            .service(web::resource("/").route(web::get().to(templates::index::index)))
            .service(web::resource("/index").route(web::get().to(templates::index::index)))
            .service(web::resource("/about").route(web::get().to(templates::about::about)))
            .service(fs::Files::new("/assets", "./files/assets").show_files_listing())
            .service(fs::Files::new("/img", "./files/img").show_files_listing())
            .service(fs::Files::new("/picture", "./files/picture").show_files_listing())
            .service(fs::Files::new("/test", "./files/test").show_files_listing())
            .service(web::scope("").wrap(templates::error::error_handlers()))
    })
    .bind("0.0.0.0:7000")? //http
    //.bind_openssl("0.0.0.0:7000", builder)? //https
    .run()
    .await
}
