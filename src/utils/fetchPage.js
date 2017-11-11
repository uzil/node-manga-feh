'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');

const transformFn = body => cheerio.load(body);

module.exports = (resourceURL, options) => {
  const headers = options.userAgent
    ? { 'User-Agent': options.userAgent }
    : null;

  return request({
    headers,
    uri: resourceURL,
    transform: transformFn
  });
};
