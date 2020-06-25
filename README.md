# Folder Builder

Easy way to build folder structure for [node](http://nodejs.org)

[![Build Status](https://travis-ci.org/tubuarge/folder-builder.svg?branch=master)](https://travis-ci.org/tubuarge/folder-builder)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/tubuarge/folder-builder)
[![codecov](https://codecov.io/gh/tubuarge/folder-builder/branch/master/graph/badge.svg)](https://codecov.io/gh/tubuarge/folder-builder)
[![GitHub issues](https://img.shields.io/github/issues/tubuarge/folder-builder)](https://github.com/tubuarge/folder-builder/issues)
[![GitHub license](https://img.shields.io/github/license/tubuarge/folder-builder)](https://github.com/tubuarge/folder-builder/blob/master/LICENSE)

```js
const FolderBuilder = require('../src');

// Create a new FolderBuilder instance with path
const fb = new FolderBuilder(__dirname);

// Create a new folder instance with name
const newFolder = fb.createFolder('ex1');


// Build a new folder
newFolder.build(newFolder).catch(console.error);
```


It helps you to create files and folders easily. It can create files inside other folders recursively. Can create, delete, update files and or folders at the same time. Add this to your package.json file and it is ready to use.

## Get Started
`FolderBuilder` is used to create a new folder management system.

```js
const fb = new FolderBuilder(__dirname);
```
#### Constructor Parameters

String -> Folder default path

Object -> Folder and File default [Options](#file-options)

Example:
```js
new FolderBuilder({
    "defaultFolder": {
                "name" : "sample",
                "path" : __dirname  
            },
    "defaultFile": {
                "mode" : 0o555
            }
    });
```

Main Folder Builder Methods
- [createFolder()](#createfolder)

    Create [folder](#folder) instance
    
- [createFile()](#createfile)

    Create [file](#file) instance
    
---

#### createFolder
`fb.createFolder(folder)`

Returns a new [folder](#folder) instance

##### Parameters
String -> Folder Name

Object -> Folder [Options](#folder-options)

---


#### createFile
`const newFolder = fb.createFile(file)`

Returns a new [file](#file) instance

##### Parameters
String -> Folder Name

Object -> File Options

---
### Folder
Folder instance for management folder works

##### Folder Options
```js
 fb.createFolder({
    name : 'sample',
    path : __dirname,
    force : false,
    archive : false
})
```
- name : Folder name (required)
- path : Path to build current folder
- force : Force to build folder, delete if exists
- archive : Generate a zip file of current folder, current path

Folder Methods
- [addFolder()](#addFolder)
- [addFile()](#addFile)
- [build()](#build)
---

#### addFolder
Add a child folder into the current folder, 
and return a new folder instance

`newFolder.addFolder(folder)`

##### Parameters
String -> Folder Name

Object -> Folder [Options](#folder-options)

---

#### addFile
Add a child file into the current folder,
return a new file instance

`newFolder.addFile(folder)`

##### Parameters
String -> File Name

Object -> Folder [Options](#folder-options)

---

#### build

Build the folder with its children as folders and files, recursively.
> Also, create zip files if `archive` of the folder is `true`

`newFolder.build()`

---

### File
File instance for management file works


##### File Options
Options
```js
 fb.createFile({
    name : 'sample.txt',
    content : 'hello',
    mode : 0o666
})
```
- name : File name
- content : Content of file
- mode : File permissions, for [detail](https://nodejs.org/api/fs.html#fs_file_modes)

> Warning : To insert the content into the file during building process, mode must include Write Permission

File Methods
- [Render()](#render)

---
#### render
Render the current file content, 
and return rendered file instance

`newFile.render(renderObj)`

##### Parameters
Object -> Key-Value to render object inside the current file content, it uses $[key] to refer a key inside the current file content

Example
```js
const FolderBuilder = require('../src');

// Create a new FolderBuilder instance with path
const fb = new FolderBuilder(__dirname);

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
  name: 'FolderBuilder User',
  age: 21,
});

// Adding a rendered bash file into created folder
newFolder.addFile(renderedNewFile);

// Build a new folder
newFolder.build().catch(console.error);

// So, it will be executed
// ./ex5/sample.sh
// -> hello from FolderBuilder User
// -> You FolderBuilder User! You are adult
```
---

## Examples

For more examples, look at [examples folder](./examples) .

---
## License
[MIT](LICENSE)
