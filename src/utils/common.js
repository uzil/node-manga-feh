'use strict';

const url = require('url');
const Promise = require('bluebird');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const fetchPageDOM = require('./fetchPage');
const { TEMPELATE_URL_REGEX } = require('../../config');

const protocols = ['http:', 'https:'];

const validateURL = (resourceURL) => {
  const { protocol, host, href } = url.parse(resourceURL);

  if (!~protocols.indexOf(protocol)) {
    throw new TypeError(`Unsupported URL protocol ${protocol}`);
  }

  return { host, href, protocol };
};

const selectHost = (hosts, hostName) => {
  const host = hosts[hostName];

  if (!host) throw new TypeError(`${hostName} not supported`);

  return host;
};

const getChapterMeta = Promise.coroutine(function* (host, parsedChapterURL, options) {
  const basePath = `${parsedChapterURL.protocol}//${parsedChapterURL.host}`;

  const $chapter$ = yield fetchPageDOM(parsedChapterURL.href, options);
  const mangaName = host.getMangaName($chapter$);
  const chapter = host.getChapterNo($chapter$);
  const pageURLs = host.getChPagesURL($chapter$, basePath);
  const noOfPages = pageURLs.length;

  const pageDOMs = yield Promise.map(pageURLs, pageURL => fetchPageDOM(pageURL, options));
  const imgs = pageDOMs.map(dom => host.getChImgs(dom));

  const metadata = {
    noOfPages,
    chapter,
    manga: mangaName,
    pages: pageURLs,
    scans: imgs
  };

  return metadata;
});

const checkTmpletURLLimits = (lower, higher) => {
  if (Number.isNaN(lower) || Number.isNaN(higher)) throw new Error('Invalid limit');
  if (lower < 0) throw new Error(`Invalid limit ${lower} - ${higher}`);
  if (lower >= higher) throw new Error(`Invalid limit ${lower} - ${higher}`);
};

const parseUrlTemplate = resourceURL => resourceURL.match(TEMPELATE_URL_REGEX);
const mkdir = pathToFolder => fs.mkdirAsync(pathToFolder);
const mkPath = (parent, child) => path.resolve(path.normalize(path.join(parent, child)));
const mkChapterName = meta => `${meta.manga} Ch ${meta.chapter}`.split(' ').join('-');

const genTempelateURLs = (resourceURL) => {
  const regexMatch = parseUrlTemplate(resourceURL);

  if (!regexMatch) return [resourceURL];

  const limits = regexMatch[1].split('-').map(lim => parseInt(lim, 10));

  if (limits.length !== 2) throw new Error('Invalid limit');

  checkTmpletURLLimits(limits[0], limits[1]);

  const resourceURLs = [];
  for (let i = limits[0]; i <= limits[1]; i++) {
    resourceURLs.push(resourceURL.replace(TEMPELATE_URL_REGEX, i.toString()));
  }

  return resourceURLs;
};


module.exports = {
  validateURL,
  selectHost,
  getChapterMeta,
  mkdir,
  mkPath,
  mkChapterName,
  parseUrlTemplate,
  checkTmpletURLLimits,
  genTempelateURLs
};
