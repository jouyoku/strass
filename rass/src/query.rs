use sqlx::Database;
use sqlx::MySql;

use crate::util::query;

pub async fn languages() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM Languages WHERE isLanguageAvailable=1 ORDER BY languageShowPriority").await
}

pub async fn product_categories() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM ProductCategories WHERE 1 AND isProductCategoryEnabled=1 AND isProductCategoryAvailable=1 ORDER BY productCategoryShowPriority")
      .await
}

pub async fn products() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM Products WHERE 1 AND isProductEnabled=1 AND isProductAvailable=1 ORDER BY productShowPriority")
      .await
}

pub async fn product_skus() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM ProductSkus WHERE 1 AND isProductSKUEnabled=1 AND isProductSKUAvailable=1 ORDER BY productSKUShowPriority")
      .await
}

pub async fn product_price_tables() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM ProductPriceTables").await
}

pub async fn color_sets() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM ColorSets WHERE isColorSetAvailable=1 ORDER BY colorSetShowPriority").await
}

pub async fn functions() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM Functions WHERE isFunctionAvailable=1 ORDER BY functionShowPriority").await
}

pub async fn slides() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM Slides WHERE slideLanguage=1 AND slideStartDate <= DATE(NOW()) AND slideEndDate > DATE(NOW()) ORDER BY slideShowPriority")
      .await
}

pub async fn faqs() -> Vec<<MySql as Database>::Row> {
    query("SELECT * FROM FAQs, FAQCategories WHERE (FAQCategory = cid) AND isFAQCategoryAvailable=1 AND isFAQAvailable=1 ORDER BY FAQCategoryShowPriority,FAQShowPriority")
      .await
}

pub async fn banners() -> Vec<<MySql as Database>::Row> {
    let date = &chrono::offset::Local::now().format("%Y-%m-%d").to_string();
    let q = "SELECT * FROM Banners, BannerLayouts WHERE (bannerLayout = lid) AND isBannerAvailable = 1 AND ( '__DATE__' BETWEEN bannerStartDate AND bannerEndDate)".replace("__DATE__", date);
    query(&q).await
}

pub async fn seo_tkd_targets(url: &str) -> Vec<<MySql as Database>::Row> {
    let q = "SELECT * FROM SEOTKDTargets WHERE targetURL='__URL__'".replace("__URL__", url);
    query(&q).await
}
