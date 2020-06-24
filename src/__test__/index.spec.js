const fs = require('fs-extra');
const path = require('path');
const FormBuilder = require('../index');

const testFolderPath = path.join(__dirname, 'test_folder');

describe('FormBuilder', (() => {
  describe('createFolder', () => {
    test('create folder object correctly by name', () => {
      const fb = new FormBuilder();
      const folder = fb.createFolder('sample');

      expect(folder).toHaveProperty('name', 'sample');
      expect(folder).toHaveProperty('path');
      expect(folder).toHaveProperty('folders');
      expect(folder).toHaveProperty('files');
    });

    test('create folder object correctly by object', () => {
      const fb = new FormBuilder();
      const folder = fb.createFolder({
        name: 'sample',
        path: '/test',
      });

      expect(folder).toHaveProperty('name', 'sample');
      expect(folder).toHaveProperty('force', false);
      expect(folder).toHaveProperty('archive', false);
      expect(folder).toHaveProperty('path', '/test');
      expect(folder).toHaveProperty('folders');
      expect(folder).toHaveProperty('files');
    });

    test('error occurs when name is empty', () => {
      try {
        const fb = new FormBuilder();
        fb.createFolder('');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Folder name is empty');
      }
    });

    test('error occurs when name is number', () => {
      try {
        const fb = new FormBuilder();
        const sampleFolder = fb.createFolder('sample');
        sampleFolder.addFolder(123123);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Invalid Folder Object');
      }
    });

    test('error occurs when add same name folder', () => {
      try {
        const fb = new FormBuilder();
        const sampleFolder = fb.createFolder('sample');
        sampleFolder.addFolder('test');
        sampleFolder.addFolder('test');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Same folder name');
      }
    });
    test('error occurs when add file with invalid name', () => {
      try {
        const fb = new FormBuilder();
        const sampleFolder = fb.createFolder('sample');
        sampleFolder.addFile(123123);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Invalid file');
      }
    });
    test('error occurs when add same name file', () => {
      try {
        const fb = new FormBuilder();
        const sampleFolder = fb.createFolder('sample');
        sampleFolder.addFile('test');
        sampleFolder.addFile('test');
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Same file name');
      }
    });

    test('error occurs when folder is undefined', () => {
      try {
        const fb = new FormBuilder();
        fb.createFolder(undefined);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Folder name is empty');
      }
    });

    test('error occurs when folder name is undefined or empty', () => {
      try {
        const fb = new FormBuilder();
        fb.createFolder({ name: undefined });
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Folder name is empty');
      }
    });
  });
  describe('createFile', () => {
    test('create file correctly by name', () => {
      const fb = new FormBuilder();
      const file = fb.createFile('sample.txt');

      expect(file).toHaveProperty('name', 'sample.txt');
      expect(file).toHaveProperty('content');
      expect(file).toHaveProperty('mode', 0o666);
    });

    test('create file correctly by object', () => {
      const fb = new FormBuilder();
      const file = fb.createFile({
        name: 'sample.txt',
        chmod: 10,
        content: 'lorem ipsum',
      });

      expect(file).toHaveProperty('name', 'sample.txt');
      expect(file).toHaveProperty('content', 'lorem ipsum');
      expect(file).toHaveProperty('chmod', 10);
    });

    test('error occurs when name is empty', () => {
      const fb = new FormBuilder();
      try {
        fb.createFile('');
      } catch (error) {
        expect(error).toHaveProperty('message', 'File name is empty');
      }
    });

    test('error occurs when name is undefined', () => {
      const fb = new FormBuilder();
      try {
        fb.createFile({ name: undefined });
      } catch (error) {
        expect(error).toHaveProperty('message', 'File name is empty');
      }
    });

    test('error occurs when file is undefined', () => {
      const fb = new FormBuilder();
      try {
        fb.createFile();
      } catch (error) {
        expect(error).toHaveProperty('message', 'File name is empty');
      }
    });

    test('render a file content by object', () => {
      const fb = new FormBuilder();

      const sampleText = '$[test],$[test],$[test];;;$[test2];;;\n$[test3]';
      const file = fb.createFile({
        name: 'sample.txt',
        content: sampleText,
      });

      const renderedFile = file.render({
        test: 'sample',
        test2: 'sample2',
        test3: 'sample3',
      });

      expect(renderedFile).toHaveProperty('name', 'sample.txt');
      expect(renderedFile).toHaveProperty('content', 'sample,sample,sample;;;sample2;;;\nsample3');
    });

    test('render a file content by object with override options', () => {
      const fb = new FormBuilder();

      const sampleText = '$[test],$[test],$[test];;;$[test2];;;\n$[test3]';
      const file = fb.createFile({
        name: 'sample.txt',
        content: sampleText,
      });

      const renderedFile = file.render({
        test: 'sample',
        test2: 'sample2',
        test3: 'sample3',
      }, { name: 'new_sample.txt' });

      expect(renderedFile).toHaveProperty('name', 'new_sample.txt');
      expect(renderedFile).toHaveProperty('content', 'sample,sample,sample;;;sample2;;;\nsample3');
    });
  });
  describe('build', () => {
    beforeEach((done) => {
      fs.rmdir(testFolderPath, {
        recursive: true,
      }, (() => {
        done();
      }));
    });

    test('build a folder correctly', (done) => {
      const fb = new FormBuilder({
        defaultFolder: {
          path: testFolderPath,
        },
      });
      const folder = fb.createFolder('sample');

      folder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        done();
      });
    });

    test('build nested folder correctly', (done) => {
      const fb = new FormBuilder({
        defaultFolder: {
          path: testFolderPath,
        },
      });
      const folder = fb.createFolder('sample');
      const testFolder = fb.createFolder('test');
      const testFolder2 = fb.createFolder('test2');
      folder.addFolder(testFolder);
      testFolder.addFolder(testFolder2);

      folder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'test'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'test', 'test2'))).toBeTruthy();
        done();
      });
    });

    test('build a folder with json file', (done) => {
      const fb = new FormBuilder({
        defaultFolder: {
          path: testFolderPath,
        },
      });
      const folder = fb.createFolder('sample');

      const sampleFile = folder.addFile({
        name: 'sample.json',
        content: {
          color: 'blue',
          weight: 500,
        },
      });
      folder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        expect(JSON.parse(String(fs.readFileSync(path.join(testFolderPath, 'sample', 'sample.json'))))).toStrictEqual(sampleFile.content);
        done();
      });
    });

    test('build a folder with a mode file correctly', (done) => {
      const fb = new FormBuilder({
        defaultFolder: {
          path: testFolderPath,
        },
      });

      const folder = fb.createFolder({
        name: 'sample',
      });
      const sampleFileContent = '#!/bin/bash\necho hello';
      folder.addFile({
        name: 'sample.txt',
        content: sampleFileContent,
        mode: 0o111,
      });

      const sampleFolderPath = path.join(testFolderPath, 'sample');
      const sampleFilePath = path.join(testFolderPath, 'sample', 'sample.txt');
      folder.build().then(() => {
        expect(fs.existsSync(sampleFolderPath)).toBeTruthy();
        expect(fs.existsSync(sampleFilePath)).toBeTruthy();

        fs.access(sampleFilePath, fs.constants.X_OK, (err) => {
          expect(err).toBeFalsy();
        });
        done();
      });
    });

    test('build a folder with rendered file', (done) => {
      const fb = new FormBuilder({
        defaultFolder: {
          path: testFolderPath,
        },
      });
      const folder = fb.createFolder({
        name: 'sample',
      });

      const newFile = fb.createFile({
        name: 'sample.txt',
        content: '$[test]+++$[test]---$[test2]%%%$[]$[test3]',
      });
      const renderedNewFile = newFile.render({
        test: 'sample',
        test2: 'sample2',
        test3: 'sample3',
      });

      folder.addFile(renderedNewFile);
      folder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample.txt'))).toBeTruthy();
        expect(String(fs.readFileSync(path.join(testFolderPath, 'sample', 'sample.txt'))))
          .toBe('sample+++sample---sample2%%%$[]sample3');
        done();
      });
    });

    test('build a folder with a file correctly', (done) => {
      const fb = new FormBuilder({
        defaultFolder: {
          path: testFolderPath,
        },
      });
      const folder = fb.createFolder('sample');
      const sampleFile = fb.createFile({
        name: 'sample.txt',
        content: 'sample sample',
      });
      folder.addFile(sampleFile);
      folder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample.txt'))).toBeTruthy();
        expect(String(fs.readFileSync(path.join(testFolderPath, 'sample', 'sample.txt')))).toBe('sample sample');
        done();
      });
    });

    test('build nested folder with files correctly', (done) => {
      const fb = new FormBuilder(testFolderPath);
      const sampleFolder = fb.createFolder('sample');
      const sampleFolder2 = sampleFolder.addFolder('sample2');

      const sampleFolder3 = sampleFolder2.addFolder('sample3');

      sampleFolder.addFile('sample.txt');
      sampleFolder.addFile('sample2.txt');

      sampleFolder3.addFile('sample3.txt');
      sampleFolder2.addFile('sample4.txt');

      sampleFolder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2', 'sample4.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2', 'sample3'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2', 'sample3', 'sample3.txt'))).toBeTruthy();
        done();
      });
    });

    test('build a folder with a file and archive correctly', (done) => {
      const fb = new FormBuilder({
        defaultFolder: {
          path: testFolderPath,
        },
      });
      const folder = fb.createFolder({
        name: 'sample',
        archive: true,
      });
      const sampleFile = fb.createFile('sample.txt');
      folder.addFile(sampleFile);

      folder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample.zip'))).toBeTruthy();
        expect(fs.statSync(path.join(testFolderPath, 'sample.zip')).size).toBeGreaterThan(1);
        done();
      });
    });

    test('build nested folder with files correctly', (done) => {
      const fb = new FormBuilder(testFolderPath);

      const sampleFolder = fb.createFolder('sample');
      const sampleFolder2 = fb.createFolder({
        name: 'sample2',
        archive: true,
      });
      const sampleFolder3 = fb.createFolder({
        name: 'sample3',
        archive: true,
      });
      const sampleFile = fb.createFile('sample.txt');
      const sampleFile2 = fb.createFile('sample2.txt');
      const sampleFile3 = fb.createFile('sample3.txt');
      const sampleFile4 = fb.createFile({
        name: 'sample4.txt',
        content: 'test test',
      });

      sampleFolder.addFile(sampleFile);
      sampleFolder.addFile(sampleFile2);

      sampleFolder3.addFile(sampleFile3);
      sampleFolder2.addFile(sampleFile4);

      sampleFolder2.addFolder(sampleFolder3);
      sampleFolder.addFolder(sampleFolder2);

      sampleFolder.build().then(() => {
        expect(fs.existsSync(path.join(testFolderPath, 'sample'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2.zip'))).toBeTruthy();
        expect(fs.statSync(path.join(testFolderPath, 'sample', 'sample2.zip')).size).toBeGreaterThan(1);
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2', 'sample4.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2', 'sample3'))).toBeTruthy();
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2', 'sample3.zip'))).toBeTruthy();
        expect(fs.statSync(path.join(testFolderPath, 'sample', 'sample2', 'sample3.zip')).size).toBeGreaterThan(1);
        expect(fs.existsSync(path.join(testFolderPath, 'sample', 'sample2', 'sample3', 'sample3.txt'))).toBeTruthy();
        done();
      });
    });

    afterAll((done) => {
      fs.rmdir(testFolderPath, {
        recursive: true,
      }, (() => {
        done();
      }));
    });
  });
}));
