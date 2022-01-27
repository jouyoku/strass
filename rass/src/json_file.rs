use crate::util;

pub async fn inspiration_data() -> serde_json::Value {
    util::load_json_file(
        "inspiration.json",
    )
    .await
}

pub struct PageArticle {
    i18n: String,
    content: serde_json::Value,
}

impl PageArticle {
    pub async fn new(_i18n: &str) -> PageArticle {
        PageArticle {
            i18n: _i18n.to_string(),
            content: util::load_json_file(
                "language.json",
            )
            .await,
        }
    }

    pub fn str(&self, id: &str) -> String {
        util::i18n_str(&self.i18n, self.content[id].to_string())
    }
}
