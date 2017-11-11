'use strict';

const name = 'MangaReader';

const hosts = [
  'www.mangareader.net'
];

const getChImgs = $ => $('#img').attr('src');
const getMangaName = $ => ($('.c2 a', '#mangainfo').attr('title')).replace(/Manga/i, '').trim();
const getChapterNo = $ => parseInt(($('h1', '#mangainfo').text()).match(/\d+$/)[0], 10);
const getChPagesURL = ($, basePath) => $('#pageMenu').children().map(function () {
  return `${basePath}${$(this).attr('value')}`;
}).get();

module.exports = {
  name,
  hosts,
  getChPagesURL,
  getChImgs,
  getMangaName,
  getChapterNo
};
