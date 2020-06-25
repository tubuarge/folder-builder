/*!
 * folder-builder
 * Copyright(c) 2020 TUBU ARGE
 * MIT Licensed
 */

const { readFromFile } = require('../helpers/FileHelper');

/**
 * Render the content of file and return a new file with rendered content
 * @param renderObj Object Key-Value, key is showed as $[key] inside the content
 * @param options Overiding options for rendered file
 */
function render(renderObj, options = {}) {
  let resultText = this.content;

  if ((typeof resultText === 'string' && resultText.trim().length === 0) || typeof resultText === 'object') {
    throw new Error('Empty or Object Content');
  }

  const keys = Object.keys(renderObj);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = renderObj[key];
    const searchReg = new RegExp(`\\$\\[${key}\\]`, 'g');
    resultText = resultText.replace(searchReg, value);
  }
  // eslint-disable-next-line no-proto
  return Object.create({ ...this.__proto__, ...options, content: resultText });
}

/**
 * Read a file to fill file content
 * @param contentUrl {String | undefined} a path to read file, default content of File object
 * @returns {File} returns File with filling content
 */
function read(contentUrl) {
  if (contentUrl) {
    this.contentUrl = contentUrl;
  }

  this.content = readFromFile(this.contentUrl);

  return this;
}

/**
 * File Object
 * @param file {Object}
 * @constructor
 */
const File = function FileCreator(file) {
  const fileBase = {
    name: '',
    content: '',
    contentUrl: '',
    mode: 0o666,
    render,
    read,
  };

  if (file && file.contentUrl && !(file.content)) {
    fileBase.content = readFromFile(file.contentUrl);
  }

  if (typeof file === 'object') {
    if (!file.name || !file.name.trim()) {
      throw new Error('File name is empty');
    }
    // eslint-disable-next-line no-proto
    if (file.__proto__.name) {
      return file;
    }
    return Object.create({ ...fileBase, ...file });
  }

  if (typeof file === 'string') {
    if (!file || !file.trim()) {
      throw new Error('File name is empty');
    }
    return Object.create({ ...fileBase, ...{ name: file } });
  }

  throw new Error('File is undefined');
};

module.exports = File;
