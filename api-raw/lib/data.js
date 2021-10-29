//Dependency
const fs = require("fs");
const path = require("path");
const { FILE_MODE } = require("../helpers/helper.enums");

const db = {};

db.baseDir = path.join(__dirname + "/../.data");

/**
 * Save Data
 */
db.create = (dir, file, data, callback) => {
  fs.open(
    `${db.baseDir + dir}/${file}.json`,
    FILE_MODE.WRITE_OR_CREATE,
    (fileOpenErr, fileDescriptor) => {
      if (!fileOpenErr && fileDescriptor) {
        const text = JSON.stringify(data);
        fs.writeFile(fileDescriptor, text, (fileWriteErr) => {
          if (!fileWriteErr) {
            fs.close(fileDescriptor, (fileCloseErr) => {
              if (!fileCloseErr) {
                callback("Data save success.");
              } else {
                callback("Error closing file.");
              }
            });
          } else {
            console.log("Error writing file.");
          }
        });
      } else {
        console.log(fileOpenErr);
      }
    }
  );
};

/**
 * Retrieve data
 */
db.read = (dir, file, callback) => {
  fs.readFile(`${db.baseDir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

/**
 * Update data
 */
db.update = (dir, file, data, callback) => {
  fs.open(
    `${db.baseDir + dir}/${file}.json`,
    FILE_MODE.READ_WRITE,
    (openErr, fileDescriptor) => {
      if (!openErr && fileDescriptor) {
        const text = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, (truncateErr) => {
          if (!truncateErr) {
            fs.writeFile(fileDescriptor, text, (writeErr) => {
              if (!writeErr) {
                fs.close(fileDescriptor, (closeErr) => {
                  if (!closeErr) {
                    callback(false);
                  } else {
                    callback("Error when closing file.");
                  }
                });
              } else {
                callback("Error when writing file.");
              }
            });
          } else {
            callback("Error when truncating file");
          }
        });
      } else {
        callback("Error when opening file");
      }
    }
  );
};

/**
 * Delete data
 */
db.delete = (dir, file, callback) => {
  fs.unlink(`${db.baseDir + dir}/${file}.json`, (err) => {
    if (err) {
      callback("Error deleting data.");
    } else {
      callback(false);
    }
  });
};

module.exports = db;
