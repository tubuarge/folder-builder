/*!
 * folder-builder
 * Copyright(c) 2020 TUBU ARGE
 * MIT Licensed
 */

/**
 * Render the content of file and return a new file with rendered content
 * @param renderObj Object Key-Value, key is showed as $[key] inside the content
 * @param options Overiding options for rendered file
 */
function render(renderObj, options = {}) {
  let resultText = this.content;
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
 * File Object
 * @param file {Object}
 * @constructor
 */
const File = function FileCreator(file) {
  const fileBase = {
    name: '',
    content: '',
    mode: 0o666,
    render,
  };

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
