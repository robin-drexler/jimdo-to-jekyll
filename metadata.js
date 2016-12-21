const cheerio = require('cheerio');

module.exports = function (url, markup) {

  const getDate = (path) => {
    const matches = path.match(/\/(\d+)\/(\d+)\/(\d+)\//);

    if (!matches) {
      return null;
    }
    const [year, month, day] = matches.slice(1);

    return {
      year,
      month,
      day
    }
  };

  const date = getDate(url.pathname);
  const $ = cheerio.load(markup);
  const isBlogPost = !!date;

  const tags = $('.postmeta')
    .text()
    .split('·')
    .map(tag => tag.trim());

  return {
    isBlogPost: isBlogPost,
    date,
    permalink: url.pathname,
    // single quotes need to be escaped by doubling them
    title: `'${$('title').text().replace(' - robin drexler', '').replace(/'/g, "''")}'`,
    tags,
  };


};