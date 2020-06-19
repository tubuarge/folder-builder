const FormBuilder = require('../src');

// Create a new FormBuilder instance with path
const fb = new FormBuilder(__dirname);


// Create a new folder instance with name
const newFolder = fb.createFolder('ex1');


// Build a new folder
newFolder.build(newFolder).catch(console.error);
