const File = require('../File');

describe('File', () => {
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
  });
});
