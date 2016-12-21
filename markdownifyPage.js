const cheerio = require('cheerio');
const request = require('request');
const toMarkdown = require('to-markdown');

module.exports = function (markup) {

  function convertPToBr(html) {
    html = html.replace(/<p>/g, '');
    html = html.replace(/<\/p>/g, '</br>');

    return html;
  }

  const handlers = {
    header: function ($element) {
      return $element.html();
    },
    'blog-headline': function ($element) {
      return `<h1>${$element.html()}</h1>`;
    },
    'blog-header': function($element) {
      return this.header($element);
    },
    spacing: function($element) {
      const spacingStyle = $element.find('.cc-m-spacer').attr('style');
      return `<div style="${spacingStyle}"><span></span></div>`;
    },
    text: function ($element) {
      let html = $element.html();
      html = convertPToBr(html);

      return html;
    },
    imageSubtitle: function ($element) {
      const $img = $element.find('img');
      return `<img src="${$img.prop('src')}" />`;
    },
    textWithImage: function($element) {
      // xxx the order is ignored, image always comes first for now
      let text = $element.find('.cc-m-textwithimage-inline-rte').html();

      return [
        this.imageSubtitle($element),
        convertPToBr(text)
      ];
    },
    htmlCode: function($element) {
      $element.find('script').each(function() {
        $(this).html('//');
      })
      return `${$element.html()}`
    }
  };

  let $ = cheerio.load(markup);
  let pageMarkup = [];

  $('.j-module, .j-blog-header').each(function (i, element) {
    const $element = $(element);
    const moduleName = $element.prop('class').trim().split(' ').slice(-1)[0].replace('j-', '');


    if (handlers[moduleName]) {
      let markup = handlers[moduleName]($element);
      if (!markup) {
        return true;
      }
      if (typeof markup === 'string') {
        markup = [markup];
      }

      pageMarkup = [...pageMarkup, ...markup];


    } else {
      console.log(`Missing handler for ${moduleName}`);
    }
  });

  let pageMarkDown = pageMarkup.reduce((markdown, elementMarkup) => {
    elementMarkup = `<p>${elementMarkup}</p>`;
    const elementMarkdown = toMarkdown(elementMarkup);

    return markdown + "\n" + elementMarkdown;
  }, '');

  return pageMarkDown;
};