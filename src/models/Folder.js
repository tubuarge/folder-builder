/*!
 * folder-builder
 * Copyright(c) 2020 TUBU ARGE
 * MIT Licensed
 */

// Helpers
const FolderHelper = require('../helpers/FolderHelper');

// Modes
const File = require('./File');

/** *
 * Add new Folder
 * @param folder {String, Object} Folder name or Folder Object
 * @returns {Folder} return added folder object
 */
function addFolder(folder) {
  if (FolderHelper.isInSameName(this.folders, folder.name || folder)) {
    throw new Error('Same folder name');
  }
  if (folder && (typeof folder === 'object' || typeof folder === 'string')) {
    // eslint-disable-next-line no-use-before-define
    const newFolder = new Folder(folder);
    this.folders.push(newFolder);
    return newFolder;
  }

  throw new Error('Invalid Folder Object');
}

/** *
 * Add File into the folder
 * @param file {String, File} File Name or File Object
 * @params returnFile {Boolean} Returns file object
 */
function addFile(file) {
  if (FolderHelper.isInSameName(this.files, file.name || file)) {
    throw new Error('Same file name');
  }
  if (file && (typeof file === 'object' || typeof file === 'string')) {
    const newFile = new File(file);

    this.files.push(newFile);
    return newFile;
  }
  throw new Error('Invalid file');
}

/** *
 * Build folder in folder path
 */
function build() {
  return FolderHelper.controlAndCreate(this.path, this)
    .then(() => FolderHelper.controlAndArchive(this.path, this));
}

const Folder = function createFolder(folder) {
  const folderBase = {
    name: '',
    path: '',
    force: false,
    archive: false,
    folders: [],
    files: [],
    addFolder,
    addFile,
    build,
  };

  if (typeof folder === 'object') {
    if (!folder.name || !folder.name.trim()) {
      throw new Error('Folder name is empty');
    }
    // eslint-disable-next-line no-proto
    if (folder.__proto__.name) {
      return folder;
    }
    return Object.create({ ...folderBase, ...folder });
  }

  if (typeof folder === 'string') {
    return Object.create({ ...folderBase, ...{ name: folder } });
  }

  throw new Error('Folder is undefined');
};

module.exports = Folder;
