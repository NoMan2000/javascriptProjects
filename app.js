const cluster = require('cluster'),
    app = require('./mainApp'),
    totalCpus = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < totalCpus; i += 1) {
        cluster.fork();
    }
} else {
    app();
}
