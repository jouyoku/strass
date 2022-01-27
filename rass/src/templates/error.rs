use actix_http::{body::Body, Response};

use actix_web::dev::ServiceResponse;
use actix_web::http::StatusCode;
use actix_web::middleware::errhandlers::{ErrorHandlerResponse, ErrorHandlers};
use actix_web::Result;

use sailfish::TemplateOnce;

#[derive(TemplateOnce)]
#[template(path = "error.html")]
struct ErrorTemplate<'a, 'b> {
    error: &'a str,
    status_code: &'b str,
}

// Custom error handlers, to return HTML responses when an error occurs.
pub fn error_handlers() -> ErrorHandlers<Body> {
    ErrorHandlers::new().handler(StatusCode::NOT_FOUND, not_found)
}

// Error handler for a 404 Page not found error.
fn not_found<B>(res: ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>> {
    let response = get_error_response(&res, "Page not found");
    Ok(ErrorHandlerResponse::Response(
        res.into_response(response.into_body()),
    ))
}

// Generic error handler.
fn get_error_response<B>(res: &ServiceResponse<B>, error: &str) -> Response<Body> {
    let status = res.status();
    let s = ErrorTemplate {
        error: error,
        status_code: status.as_str(),
    };

    Response::build(res.status())
        .content_type("text/html")
        .body(s.render_once().unwrap())
}
