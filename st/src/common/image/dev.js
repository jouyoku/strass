if (import.meta.env.MODE !== 'production') {
  if(!window.ss) {
    let serverUrl = 'https://www.msbt.com.tw';
    //let serverUrl = 'http://localhost:5000';
    //let serverUrl = '';

    window.ss_image_url = JSON.stringify({
      img: serverUrl + '/img',
      picture: {
        src: serverUrl + '/picture/src',
        webp: serverUrl + '/picture/webp',
        jp2: serverUrl + '/picture/jp2',
        xs: serverUrl + '/picture/xs/src',
        xsWebp: serverUrl + '/picture/xs/webp',
        xsJp2: serverUrl + '/picture/xs/jp2',
      },
      i18n: 'zh-TW',
      //i18n: 'en-US',
    });

    console.log('window.ss_image_url', window.ss_image_url);
  }
}
