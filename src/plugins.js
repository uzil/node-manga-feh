'use strict';

const glob = require('glob');
const path = require('path');

// const pluginList = glob.sync(`${__dirname}/plugins/*.plugin.js`);

const initPluginHosts = pluginsList => pluginsList.reduce((acc, pluginPath) => {
  // eslint-disable-next-line
  const plugin = require(path.resolve(pluginPath));

  plugin.hosts.forEach((host) => {
    acc[host] = plugin;
  });

  return acc;
}, []);

module.exports = initPluginHosts(glob.sync(`${__dirname}/plugins/*.plugin.js`));
