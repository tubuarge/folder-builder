const path = require('path');
const fs = require('fs-extra');
const { isInSameName, generateFolder } = require('../../src/helpers/FolderHelper');

describe('FolderHelper', () => {
  describe('isInSameName', () => {
    test('correctly returns false', () => {
      expect(isInSameName([
        { name: 'test.txt' },
        { name: 'sample.txt' },
        { name: 'test.json' },
      ], 'test2.txt')).toBeFalsy();
    });
    test('correctly returns true', () => {
      expect(isInSameName([
        { name: 'test.txt' },
        { name: 'sample.txt' },
        { name: 'test.json' },
      ], 'test.txt')).toBeTruthy();
    });
  });

  describe('generateFolder', () => {
    const testFolderPath = path.join(__dirname, 'test');

    afterEach((done) => {
      fs.rmdir(testFolderPath).then(() => {
        done();
      });
    });

    test('Folder, if not exists', async () => {
      await generateFolder(testFolderPath);
      expect(fs.existsSync(testFolderPath)).toBeTruthy();
    });

    test('Folder, if exists', async () => {
      await generateFolder(testFolderPath);
      await generateFolder(testFolderPath, false);
      expect(fs.existsSync(testFolderPath)).toBeTruthy();
    });

    test('Folder, if exists with force', async () => {
      const sampleFolderPath = path.join(testFolderPath, 'sample');
      await generateFolder(testFolderPath);
      await generateFolder(sampleFolderPath);

      await generateFolder(testFolderPath, true);
      expect(fs.existsSync(testFolderPath)).toBeTruthy();
      expect(fs.existsSync(sampleFolderPath)).toBeFalsy();
    });
  });
});
