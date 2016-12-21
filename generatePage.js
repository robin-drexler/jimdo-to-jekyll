const markdownifyPage = require('./markdownifyPage');
const getMetadata = require('./metadata');

const fs = require('fs');
const request = require('request');
const slug = require('slug');


module.exports = function (url) {
  return new Promise((resolve) => {
    const dirname = '/Users/robin/Development/robin-drexler.com';

    request(url.href, (error, response, body) => {
      const markdown = markdownifyPage(body);
      const result = Object.assign({}, {markdown}, getMetadata(url, body));
      let pageMarkdown;
      let path = '';
      let filename = '';

      if (result.isBlogPost) {
        filename = `${result.date.year}-${result.date.month}-${result.date.day}-${result.title}`;
        path = '_posts';
        pageMarkdown = `---
layout: post
title:  ${result.title}
permalink: ${result.permalink}
date:   ${result.date.year}-${result.date.month}-${result.date.day} 00:00:00
categories: ${result.tags.join(' ')}
---
`
      } else {

        filename = result.title;
        pageMarkdown = `---
layout: page
title:  "${result.title}"
permalink: ${result.permalink}
---

`
      }

      filename = slug(filename.toLowerCase()) + '.markdown';
      pageMarkdown += "\n" + markdown;
      fs.writeFileSync(`${dirname}/${path}/${filename}`, pageMarkdown);

      resolve(filename);
    });
  })
};