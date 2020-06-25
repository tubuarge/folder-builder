/*!
 * folder-builder
 * Copyright(c) 2020 TUBU ARGE
 * MIT Licensed
 */

// required
const fs = require('fs-extra');

/**
 * Check to convert content an object
 * @param {String|Buffer} content
 * @returns {object|undefined} return object if content can be converted an object,
 * otherwise undefined
 */
function tryToJSON(content) {
  try {
    if (typeof (content) === 'string' && content.length === 0) {
      return undefined;
    }

    return JSON.parse(content);
  } catch (e) {
    return undefined;
  }
}

/**
 * Read From a File by using File Path
 * @param filePath Reading File Path
 * @returns {object | string} returns json if file content is json, otherwise string
 */
function readFromFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);

    return tryToJSON(fileContent) || String(fileContent);
  } catch (e) {
    throw new Error('Invalid File Path for Content');
  }
}

module.exports = {
  tryToJSON,
  readFromFile,
};
