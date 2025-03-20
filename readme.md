# Remote File Explorer
This is a basic file explorer that facilitates different file/folder operations in file/folders that are in cloud buckets. It is programmed to be generic so that it supports any bucket. In this version, I implemented for Azure.

## Features
- File upload
    - Single or multiple
    - Root or any specified folder
- Folder Creation
- List files
    - Root or any specified folder
    - Search by name
- Download
    - Single file as original format
    - Multiple files as zipped
- Delete
    - Single or multiple files deletion
- Auth
    - user creation
    - user login
- Swagger for api documentation

## Prerequisites
- node.js  
- npm
- Database: mysql 

## Technologies Used
- node.js (version 22)
- [nest.js](https://nestjs.com/)
- typescript
- typeorm
- passport.js
- es-lint
- prettier
- jest
- swagger
- Rate Limiting

## Getting Started
Follow these steps to get the project up and running on your local machine.

1. ### Clone the Repository
```bash
git clone git@github.com:tajul-saajan/remote-file-explorer.git
cd remote-file-explorer
```

2. ### Install dependencies
```bash
npm install
```

3. ### Setup environment variables 
4. ### Setup Database
5. #### For swagger documentation go to `BASE_URL/api` endpoint

## Further Improvements
- add basic unit tests
- pagination in search result
