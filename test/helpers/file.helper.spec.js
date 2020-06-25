const path = require('path');
const fs = require('fs-extra');
const { tryToJSON, readFromFile } = require('../../src/helpers/FileHelper');

describe('FileHelper', () => {
  describe('tryToJSON', () => {
    test('correctly returns undefined', () => {
      expect(tryToJSON('')).toBeFalsy();
    });
    test('correctly returns undefined', () => {
      expect(tryToJSON('Hellooo')).toBeFalsy();
    });
    test('correctly returns true', () => {
      expect(tryToJSON('{ "name" :"tubu" } ')).toBeTruthy();
    });
  });

  describe('readFromFile', () => {
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

    test('Correctly read from txt', async () => {
      const sampleFile = path.join(testFolderPath, 'sample.txt');

      fs.writeFileSync(path.join(testFolderPath, 'sample.txt'), 'Hello from Earth!');
      expect(readFromFile(sampleFile)).toBe('Hello from Earth!');
    });

    test('Correctly read from json', async () => {
      const sampleFile = path.join(testFolderPath, 'sample.txt');

      fs.writeFileSync(path.join(testFolderPath, 'sample.txt'), '{ "name" : "TubuArge" }');

      expect(readFromFile(sampleFile)).toStrictEqual({ name: 'TubuArge' });
    });
  });
});
