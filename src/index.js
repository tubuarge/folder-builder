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
  if (typeof folder === 'string') {
    if (!folder || !folder.trim()) {
      throw new Error('Folder name is empty');
    }
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

  return new Folder(this.options.defaultFolder);
};

FolderBuilder.prototype.createFile = function createFile(file) {
  if (typeof file === 'string') {
    if (!file || !file.trim()) {
      throw new Error('File name is empty');
    }
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
  return new File(this.options.defaultFile);
};

module.exports = FolderBuilder;
