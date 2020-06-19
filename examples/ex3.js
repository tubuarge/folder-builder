const FolderBuilder = require('../src');

// Create a new FolderBuilder instance with path
const fb = new FolderBuilder(__dirname);

// Create a new folder instance with name
const newFolder = fb.createFolder('ex3');

// Adding a new folder into created folder
const insideFolder = newFolder.addFolder({ name: 'inside' });

// Adding a new file into created folder
newFolder.addFile({
  name: 'sample.txt',
  content: 'sample text ',
});

// Adding a file into inside folder which was added into created folder
insideFolder.addFile({
  name: 'inside.txt',
  content: 'inside sample text ',
});

// Build a new folder
newFolder.build().catch(console.error);
