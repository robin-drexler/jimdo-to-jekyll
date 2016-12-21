const generatePage = require('./generatePage');
const URL = require('url');
const Sitemapper = require('sitemapper');
const sitemapper = new Sitemapper();

// const urls = ['https://www.robin-drexler.com/projects/', 'https://www.robin-drexler.com/2015/02/28/contriboot/'];

sitemapper.fetch('https://www.robin-drexler.com/sitemap.xml').then(function({sites}) {
  // sites = ['https://www.robin-drexler.com/2015/08/16/til-getter-and-setter-in-javascript/'];
  sites.reduce((promise, url) => {
    url = URL.parse(url);
    return promise.then(() => {
      console.log(url.href);
      return generatePage(url)
    })
  }, Promise.resolve());
});
