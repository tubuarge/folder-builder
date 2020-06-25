const Folder = require('../Folder');

describe('Folder', () => {
  describe('constructor', () => {
    test('error occurs when undefined parameter', () => {
      try {
        const sampleFolder = new Folder();
        sampleFolder.addFile();
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('Folder is undefined');
      }
    });
  });
});
