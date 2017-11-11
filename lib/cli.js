'use strict';

const Promise = require('bluebird');
const program = require('commander');
const spinner = require('ora');
const chalk = require('chalk');
const pkg = require('../package.json');
const hosts = require('../src/plugins');
const common = require('../src/utils/common');
const downloader = require('../src/utils/downloader');
const { USER_AGENT } = require('../config');

program.version(pkg.version).usage('[options] <url> <path>').parse(process.argv);

const pathToSave = program.args[1] || process.cwd();

const initiateDownload = Promise.coroutine(function* (host, parsedURL, options) {
  console.log('\n');

  const metadataSpin = spinner(`Fetching Metadata [${parsedURL.href}]`).start();
  const meta = yield common.getChapterMeta(host, parsedURL, options);
  if (!meta.scans.length) {
    metadataSpin.fail();
    throw new Error('Cannot find any scans for chapter');
  }
  metadataSpin.succeed();

  const chapterPath = common.mkChapterName(meta);

  const folderSpin = spinner('Creating folder').start();
  yield common.mkdir(common.mkPath(pathToSave, chapterPath));
  folderSpin.succeed();

  return downloader(meta.scans, {
    path: common.mkPath(pathToSave, chapterPath),
    chapterName: meta.chapter
  });
});

Promise.coroutine(function* (url, options) {
  console.log(`${chalk.green('[URL]:')} ${url}`);
  const parsedURL = common.validateURL(url);

  const host = common.selectHost(hosts, parsedURL.host);
  console.log(`${chalk.green('[HOST]:')} ${host.name}`);

  const URLs = common.genTempelateURLs(url);

  yield Promise.mapSeries(URLs, chapterUrl =>
    initiateDownload(host, common.validateURL(chapterUrl), options));
})(program.args[0], { userAgent: USER_AGENT })
  .catch((error) => {
    console.log(chalk.red(error.message));
    process.exit(1);
  });
