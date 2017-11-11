'use strict';

const Promise = require('bluebird');
const request = require('request');
const ProgressBar = require('progress');
const fs = require('fs');

const download = (urls, options = { path: process.cwd() }) => {
  const len = urls.length;

  const bar = new ProgressBar(`Downloading Ch ${options.chapterName || ''} :bar :percent | :current/:total | :etas`, {
    complete: '▓', // '='
    incompete: '░', // ' '
    width: 20,
    total: len
  });

  return Promise.map(urls, (url, index) => {
    const fileName = `${index + 1}.jpg`;

    return new Promise((resolve, reject) => {
      request(url)
        .on('error', error => reject(error))
        .on('end', () => {
          bar.tick();
          return resolve(true);
        })
        .pipe(fs.createWriteStream(`${options.path}/${fileName}`));
    });
  }, { concurrency: 10 });
};

module.exports = download;
