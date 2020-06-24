// required
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

/** *
 * Control a name into a list
 * @param list list for searching
 * @param name searching name
 * @returns {boolean} If exists returns true, or not returns false
 */
function isInSameName(list = [], name = '') {
  return list.some((folder) => folder.name === name);
}

/**
 *
 * @param selectedPath {String} the main path to generate folder
 * @param force {Boolean} Recreate if the folder exists
 * @returns {Promise<unknown>|Promise<void>}
 */
function generateFolder(selectedPath, force = true) {
  if (!fs.pathExistsSync(selectedPath)) {
    return fs.mkdirp(selectedPath);
  }
  if (force) {
    return fs.remove(selectedPath).then(() => fs.mkdirp(selectedPath));
  }
  return new Promise((resolve) => {
    resolve();
  });
}

/**
 * Create archive file of selected folder
 * @param archivePath {String} Source path for archive
 */
function archiveFolder(archivePath) {
  return new Promise((resolve) => {
    const output = fs.createWriteStream(`${archivePath}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => {
      resolve();
    });
    archive.pipe(output);
    archive.directory(archivePath, false);
    archive.finalize();
  });
}

/** *
 * Control folder archive field recursively
 * @param mainPath {String} Main Path of Folder
 * @param newFolder {Folder} Folder Instance
 * @returns {Promise}
 */
function controlAndArchive(mainPath, newFolder) {
  const archivedPromises = [];

  function archiveFolderRec(currentPath, currentFolder) {
    if (typeof currentFolder === 'object' && currentFolder.name) {
      const folderPath = path.join(currentPath, currentFolder.name);

      if (currentFolder.archive) archivedPromises.push(archiveFolder(folderPath));

      if (currentFolder.folders) {
        currentFolder.folders.forEach((childFolder) => archiveFolderRec(folderPath, childFolder));
      }
    }
  }

  archiveFolderRec(mainPath, newFolder);

  return Promise.all(archivedPromises);
}

/** *
 * Control and build folder recursively
 * @param mainPath {String} Main Path of Folder
 * @param currentFolder{Folder} Folder Instance to Build
 * @returns {Promise}
 */
function controlAndCreate(mainPath, currentFolder) {
  const generationPromises = [];

  function createFolderRec(currentPath, newFolder) {
    if (typeof newFolder === 'object' && newFolder.name) {
      const folderPath = path.join(currentPath, newFolder.name);

      const generation = generateFolder(folderPath, newFolder.force, newFolder.chmod).then(() => {
        if (newFolder && newFolder.files) {
          newFolder.files.forEach((newFile) => {
            let writeValue = newFile.content;
            const filePath = path.join(folderPath, newFile.name);
            if (typeof newFile.content === 'object') {
              writeValue = JSON.stringify(newFile.content);
            }

            fs.writeFileSync(filePath, writeValue || '');

            fs.chmodSync(filePath, newFile.mode || 0o666);
          });
        }
      });

      generationPromises.push(generation);

      if (newFolder.folders) {
        newFolder.folders.forEach((childFolder) => createFolderRec(folderPath, childFolder));
      }
    }
  }

  createFolderRec(mainPath, currentFolder);

  return Promise.all(generationPromises);
}

module.exports = {
  isInSameName,
  controlAndCreate,
  controlAndArchive,
  generateFolder,
};
