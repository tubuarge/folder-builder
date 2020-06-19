const FormBuilder = require('../src');

// Create a new FormBuilder instance with path
const fb = new FormBuilder(__dirname);

// Create a new folder instance with name
const newFolder = fb.createFolder('ex5');

// Create a new file with template format by using $[key]
const newFileTemplate = fb.createFile({
  name: 'sample.sh',
  content: `#!/bin/bash
  echo hello, $[name]
  
  if [ $[age] -gt 18 ]
  then
    echo You $[name]! You are adult.
  fi  
  
  `,
  mode: 0o555,
});

// Basic render created template
const renderedNewFile = newFileTemplate.render({
  name: 'FormBuilder User',
  age: 21,
});

// Adding a rendered bash file into created folder
newFolder.addFile(renderedNewFile);

// Build a new folder
newFolder.build().catch(console.error);

// So, it will be executed
// ./ex5/sample.sh
// -> hello from FormBuilder User
// -> You FormBuilder User! You are adult
