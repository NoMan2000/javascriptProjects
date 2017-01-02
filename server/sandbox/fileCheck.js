const fs = require('fs');

/**
 * The fat arrow operation does not allow binding, it takes care of it automatically
 * @constructor
 */

let FileObj = function () {
    this.filename = '';
    this.file_exists = function (callback) {
        console.log("About to open " + this.filename);
        fs.open(this.filename, 'r', function (err, handle) {
            if (err) {
                console.log("Cannot open: " + this.filename);
                if (callback) {
                    return callback(err);
                } else {
                    return null;
                }
            }
            fs.close(handle);
            return callback(null, true);
        }.bind(this));
    }
};

let FileObj2 = function () {
    let self = this;
    self.filename = '';
    self.file_exists = (callback) => {
        console.log("About to open " + self.filename);
        fs.open(self.filename, 'r', (err, handle) => {
            if (err) {
                console.log("Cannot open: " + self.filename);
                if (callback) {
                    return callback(err);
                } else {
                    return null;
                }
            }

            fs.close(handle);
            return callback(null, true);
        });
    }
};

let FileObj3 = function () {
    this.filename = '';
    this.file_exists = (callback) => {
        console.log("About to open " + this.filename);
        fs.open(this.filename, 'r', (err, handle) => {
            if (err) {
                console.log("Cannot open: " + this.filename);
                if (callback) {
                    return callback(err);
                } else {
                    return null;
                }
            }

            fs.close(handle);
            return callback(null, true);
        });
    }
};

class FileObjClass {

    constructor(filename) {
        this.filename = filename;
    }

    file_exists(callback) {
        console.log("About to open " + this.filename);
        fs.open(this.filename, 'r', (err, handle) => {
            if (err) {
                console.log("Cannot open: " + this.filename);
                if (callback) {
                    return callback(err);
                } else {
                    return null;
                }
            }

            fs.close(handle);
            return callback(null, true);
        });
    }
}

let fo = new FileObj(),
    fo2 = new FileObj2(),
    fo3 = new FileObj3(),
    foClass = new FileObjClass();
foClass.filename = fo3.filename = fo2.filename = fo.filename = 'This does not exist.';

let file_exists = (err, callback) => {
    if (err) {
        console.log("error opening file: " + JSON.stringify(err));
        return err;
    }
    if (callback) {
        return callback();
    }
};


fo.file_exists();
fo2.file_exists();
fo3.file_exists();
foClass.file_exists();
