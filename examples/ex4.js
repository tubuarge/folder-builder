const FolderBuilder = require('../src');

// Create a new FolderBuilder instance with path
const fb = new FolderBuilder(__dirname);

// Create a new folder instance with name
const newFolder = fb.createFolder('ex4');

// Adding a new folder into created folder
const insideFolder = newFolder.addFolder({ name: 'inside' });

// Adding a new file into created folder
newFolder.addFile({
  name: 'sample.txt',
  content: 'sample text ',
});

// Adding a bash file into inside folder which was added into created folder
insideFolder.addFile({
  name: 'hello.sh',
  content: '#!/bin/bash\necho hello from FolderBuilder',
  mode: 0o555, // 555 -> readable and executable
});

// Build a new folder
newFolder.build().catch(console.error);

// So, it will be executed
// ./ex4/inside/hello.sh
// -> hello from FolderBuilder
