const path = require('path');
const fs = require('fs-extra');
const File = require('../../src/models/File');

describe('File', () => {
  const testFolderPath = path.join(__dirname, 'test');

  beforeEach((done) => {
    fs.mkdirpSync(testFolderPath);
    done();
  });

  afterEach((done) => {
    fs.remove(testFolderPath).then(() => {
      done();
    });
  });

  describe('constructor', () => {
    test('error occurs when name empty string', () => {
      try {
        const sampleFile = new File('');
        sampleFile.render();
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('File name is empty');
      }
    });
    test('error occurs when undefined parameter', () => {
      try {
        const sampleFile = new File();
        sampleFile.render();
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('File is undefined');
      }
    });

    test('error occurs when invalid contentUrl', () => {
      try {
        const sampleFile = new File({
          name: 'test.txt',
          contentUrl: './sample/test.txt',
        });
        sampleFile.render();
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('Invalid File Path for Content');
      }
    });
    test('correctly read contentUrl as String', () => {
      const sampleFilePath = path.join(testFolderPath, 'sample.txt');

      fs.writeFileSync(path.join(testFolderPath, 'sample.txt'), 'Hello from Earth!');
      const sampleFile = new File({
        name: 'sample.txt',
        contentUrl: sampleFilePath,
      });

      expect(sampleFile.content).toBe('Hello from Earth!');
    });

    test('correctly read contentUrl as Object', () => {
      const sampleFilePath = path.join(testFolderPath, 'sample.txt');

      fs.writeFileSync(path.join(testFolderPath, 'sample.txt'), '{ "name" : "Tubu Arge" }');
      const sampleFile = new File({
        name: 'sample.txt',
        contentUrl: sampleFilePath,
      });

      expect(sampleFile.content).toStrictEqual({ name: 'Tubu Arge' });
    });
  });

  describe('render', () => {
    test('error occurs when empty content', () => {
      try {
        const sampleFile = new File({
          name: 'test.txt',
        });
        sampleFile.render();
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('Empty or Object Content');
      }
    });

    test('error occurs when object content', () => {
      try {
        const sampleFile = new File({
          name: 'test.txt',
          content: {
            name: 'Tubu Arge',
          },
        });
        sampleFile.render();
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('Empty or Object Content');
      }
    });
  });

  describe('read', () => {
    test('error occurs when invalid contentUrl', () => {
      try {
        const sampleFile = new File({
          name: 'test.txt',
        });
        sampleFile.read('./sample/test.txt');
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('Invalid File Path for Content');
      }
    });

    test('correctly read default contentUrl as String', () => {
      const sampleFilePath = path.join(testFolderPath, 'sample.txt');

      fs.writeFileSync(path.join(testFolderPath, 'sample.txt'), 'Hello from Earth!');

      const sampleFile = new File({
        name: 'sample.txt',
        contentUrl: sampleFilePath,
      });

      sampleFile.content = 'Test';

      const sampleFile2 = sampleFile.read();

      expect(sampleFile2.content).toBe('Hello from Earth!');
    });

    test('correctly read new contentUrl as String', () => {
      const sampleFilePath = path.join(testFolderPath, 'sample.txt');
      const sampleFile2Path = path.join(testFolderPath, 'sample2.txt');

      fs.writeFileSync(path.join(testFolderPath, 'sample.txt'), 'Hello from Earth!');
      fs.writeFileSync(path.join(testFolderPath, 'sample2.txt'), 'Hello from Mars!');

      const sampleFile = new File({
        name: 'sample.txt',
        contentUrl: sampleFilePath,
      });

      const sampleFile2 = sampleFile.read(sampleFile2Path);

      expect(sampleFile2.content).toBe('Hello from Mars!');
    });

    test('correctly read new contentUrl as Object', () => {
      const sampleFilePath = path.join(testFolderPath, 'sample.txt');
      const sampleFile2Path = path.join(testFolderPath, 'sample.txt');

      fs.writeFileSync(sampleFilePath, '{ "name" : "Tubu Arge" }');
      fs.writeFileSync(sampleFile2Path, '{ "company" : "Tubu Arge Company" }');

      const sampleFile = new File({
        name: 'sample.txt',
        contentUrl: sampleFilePath,
      });

      const sampleFile2 = sampleFile.read(sampleFile2Path);

      expect(sampleFile2.content).toStrictEqual({ company: 'Tubu Arge Company' });
    });
  });
});
