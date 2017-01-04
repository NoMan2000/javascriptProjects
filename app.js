const cluster = require('cluster'),
    app = require('./mainApp'),
    totalCpus = require('os').cpus().length,
    hasDebug = typeof v8debug !== 'undefined';

if (cluster.isMaster && !hasDebug) {
    for (let i = 0; i < totalCpus; i += 1) {
        cluster.fork();
    }
} else {
    app();
}
