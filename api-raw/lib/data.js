//Dependency
const fs = require('fs');
const path = require('path');

const db = {};

db.baseDir = path.join(__dirname+'/../.data');

db.create = (dir, file, data, callback) => {
    fs.open(`${db.baseDir+dir}/${file}.json`, 'w', (fileOpenErr, fileDescriptor)=>{
        if(!fileOpenErr && fileDescriptor){
            const text = JSON.stringify(data);
            fs.writeFile(fileDescriptor, text, (fileWriteErr) => {
                if(!fileWriteErr){
                    fs.close(fileDescriptor, (fileCloseErr) => {
                        if(!fileCloseErr){
                            callback('Data save success.');
                        }else{
                            callback('Error closing file.');
                        }
                    })
                }else{
                    console.log('Error writing file.');
                }
            })
        }else{
            console.log(fileOpenErr);
        }
    })
}

db.read = (dir, file, callback) => {
    fs.readFile(`${db.baseDir+dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    })
}

module.exports = db;