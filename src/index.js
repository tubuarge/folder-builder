// models
const Folder = require('./models/Folder');
const File = require('./models/File');


class FolderBuilder {
  constructor(options) {
    let baseOptions = {
      defaultFolder: {},
      defaultFile: {},
    };
    if (typeof options === 'string') {
      baseOptions.defaultFolder.path = options;
    }
    if (typeof options === 'object') {
      baseOptions = { ...baseOptions, ...options };
    }
    this.options = baseOptions;
  }
}

FolderBuilder.prototype.createFolder = function createFolder(folder) {
  if (folder) {
    if (typeof folder === 'string') {
      return new Folder({
        ...this.options.defaultFolder,
        name: folder,
      });
    }
    if (typeof folder === 'object') {
      return new Folder({
        ...this.options.defaultFolder,
        ...folder,
      });
    }
  }
  return new Folder(this.options.defaultFolder);
};

FolderBuilder.prototype.createFile = function createFile(file) {
  if (file) {
    if (typeof file === 'string') {
      return new File({
        ...this.options.defaultFile,
        name: file,
      });
    }
    if (typeof file === 'object') {
      return new File({
        ...this.options.defaultFile,
        ...file,
      });
    }
  }
  return new File(this.options.defaultFile);
};

module.exports = FolderBuilder;
