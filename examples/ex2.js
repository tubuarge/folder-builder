const FormBuilder = require('../src');

// Create a new FormBuilder instance with path
const fb = new FormBuilder(__dirname);


// Create a new folder instance with name
const newFolder = fb.createFolder('ex2');

// Adding a new file into created folder
newFolder.addFile({
  name: 'sample.txt',
  content: 'sample text ',
});

// Build a new folder
newFolder.build().catch(console.error);
