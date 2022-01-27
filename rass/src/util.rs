//use std::any::type_name;
use std::mem::MaybeUninit;
//use std::sync::{Mutex, Once};
use std::sync::Mutex;

use sqlx::mysql::MySqlPoolOptions;
use sqlx::Database;
use sqlx::MySql;
use sqlx::Pool;

use serde_json;
use async_fs as fs;

async fn pool() -> &'static Mutex<Pool<MySql>> {
    static mut INIT: bool = false;
    static mut POOL: MaybeUninit<Mutex<Pool<MySql>>> = MaybeUninit::uninit();

    unsafe {
        if INIT {
            return &*POOL.as_ptr();
        }

        let pool = MySqlPoolOptions::new()
            //.max_connections(5)
            .connect("mysql://user:password$@localhost/database")
            .await
            .unwrap();
        POOL.as_mut_ptr().write(Mutex::new(pool));

        INIT = true;

        &*POOL.as_ptr()
    }
}

pub async fn query(sql: &str) -> Vec<<MySql as Database>::Row> {
    let pool = pool().await.lock().unwrap();

    let rows = sqlx::query(sql).fetch_all(&*pool).await.unwrap();

    rows
}

pub async fn load_json_file(path: &str) -> serde_json::Value {
    let data = fs::read_to_string(path).await.unwrap();
    let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");
    res
}

pub fn i18n_str(i18n: &str, src: String) -> String {
    let tmp: Vec<&str> = src.split(&(i18n.to_owned() + ">")).collect();
    let tmp2: Vec<&str> = tmp[1].split("</lang").collect();
    tmp2[0].to_string()
}
/*
pub fn type_of<T>(_: &T) -> &'static str {
    type_name::<T>()
}
*/
