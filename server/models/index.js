let fs = require('fs'),
    fileNames = fs.readdirSync('./public/views/', {}, (err, files) => {
        if (err) {
            throw err;
        }
        console.log(files);
        return files;
    });
console.log(fileNames);
console.log(__dirname);
module.exports = fileNames;
