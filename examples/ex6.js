const FormBuilder = require('../src');

// Create a new FormBuilder instance with path
const fb = new FormBuilder(__dirname);


// Create a new folder instance with name
const newFolder = fb.createFolder({
  name: 'ex6',
  archive: true, // Archiving new folder, it created a zip
});

// Adding a new folder into created folder
const insideFolder = newFolder.addFolder({
  name: 'inside',
  archive: true, // Archiving the inside folder, it created a zip
});

// Adding a new file into created folder
newFolder.addFile({
  name: 'sample.txt',
  content: 'sample text ',
});

// Adding a bash file into inside folder which was added into created folder
insideFolder.addFile({
  name: 'hello.sh',
  content: '#!/bin/bash\necho hello from FormBuilder',
  mode: 0o555, // 555 -> readable and executable
});

// Build a new folder
newFolder.build().catch(console.error);

// So, it will be executed
// ./ex4/inside/hello.sh
// -> hello from FormBuilder
