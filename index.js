//url
const url = (page) => `https://3dsky.org/3dmodels/category/stulia?style=all&order=free&page=${page}`;
//start page , end page
const min = 1, max = 1;

const puppeteer = require('puppeteer');
const fs = require('fs');
console.log('___start___');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for(let p = min ; p <= max; p ++) {
        await page.goto(url(p));
        let res = await page.$$eval('div.item', function(els){
          
            const $ = window.$;
            let arrs = [];
            for(let el of els) {
                let z = {
                    count: $(el).find('a.icon_enter').text().trim(),
                    link: $(el).find('img').attr('src')
                };
                arrs.push(z);
            }
            return arrs
        });;
        fs.writeFileSync(`./data/${p}.json`, JSON.stringify(res), 'utf-8');
        
    }

    await page.close();
    await browser.close();
    return true;

})();
