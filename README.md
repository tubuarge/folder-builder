# Folder Builder
Easy way to build folder structure via node.js

## Get Started
`FolderBuilder` is used to create a new folder management system.

```js
const fb = new FormBuilder(__dirname);
```
#### Constructor Parameters

String -> Folder default path

Object -> Folder and File default options

Example:
```js
const fb = new FormBuilder({
    "defaultFolder": {
                "name" : "sample"  
            },
    "defaultFile": {
                "mode" : 0o555
            }
    });
```

---
### Basic Example

```js
const FormBuilder = require('../src');

// Create a new FormBuilder instance with path
const fb = new FormBuilder(__dirname);

// Create a new folder instance with name
const newFolder = fb.createFolder('ex1');


// Build a new folder
newFolder.build(newFolder).catch(console.error);
```

Main Folder Builder Methods
- [createFolder()](#createFolder)

    Create [folder](#folder) instance
    
- [createFile()](#createFile)

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

Object -> Folder (Options)[folder-options]

---

#### addFile
Add a child file into the current folder,
return a new file instance

`newFolder.addFile(folder)`

##### Parameters
String -> File Name

Object -> Folder (Options)[folder-options]

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

Folder Methods
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
```
---

## Examples
For more examples, look at examples folder.
---
## License
  Copyright 2020, TUBU ARGE

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
