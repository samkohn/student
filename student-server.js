
// IMPORTS

var sys = require('sys'),
    io = require('socket.io'),
    express = require('express'),
    redis = require('redis').createClient();

var vec = require('./vec.js').vec,
    dispatcher = require('./dispatcher.js').createDispatcher();

var student = require('./student').student;


// EXPRESS

var app = express.createServer();
app.configure(function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});
app.listen(8000, 'localhost');


// SOCKET

var io = io.listen(app);
io.on('connection', function(c) {
    c.on('message', function(m) {
        dispatcher.dispatch(m, c);
    });
});


// DISPATCHER

dispatcher.register('multinomial.initialize', function(m, c) {

    writeNClasses(m.data.bucket, m.data.nclasses);

    for(var label = 0; label < m.data.nclasses; label++) {
        writeCounts(m.data.bucket, label,
                    student.multinomial.initialCounts(m.data.nfeatures));
        writeWeights(m.data.bucket, label,
                     student.multinomial.initialWeights(m.data.nfeatures));
    }
    return;
});

dispatcher.register('multinomial.update', function(m, c) {

    return readCounts(m.data.bucket, m.data.label, function(counts) {
        oldmodel = { 'counts' : counts };
        newmodel = student.multinomial.update(oldmodel, m.data.features);
        writeCounts(m.data.bucket, m.data.label, newmodel.counts);
        writeWeights(m.data.bucket, m.data.label, newmodel.weights);
        return;
    });

});

dispatcher.register('multinomial.classify', function(m, c) {

    return readNClasses(m.data.bucket, function(nclasses) {

        return readManyWeights(m.data.bucket, nclasses, function(result) {

            models = []
            for(var i = 0; i < result.length; i++) {
                models[i] = {
                    weights : result[i]
                };
            }
            
            label = student.multinomial.classify(models, m.data.features);

            // TODO give it back
            
            console.log(label);

            return c.send({
                type : 'multinomial.classify.result',
                data : label
            });
            
        });
    });
});


// DATABASE UGLIES

function writeCounts(bucket, label, values) {
    redisWriteList(bucket, 'counts', label, values);
}

function writeWeights(bucket, label, values) {
    redisWriteList(bucket, 'weights', label, values);
}

function writeNClasses(bucket, value) {
    redisWriteValue(bucket, 'nclasses', value);
}

function redisWriteList(bucket, field, label, values) {

    var key = bucket + ':' + field + ':' + label;

    return redis.del(key, function() {
        for(var i = 0; i < values.length; i++) {
            redis.lpush(key, values[i], function() {  });
        }
    });

}

function redisWriteValue(bucket, field, value) {
    var key = bucket + ':' + field;
    redis.set(key, value);
}

function readCounts(bucket, label, callback) {
    redisReadList(bucket, 'counts', label, callback);
}

function readWeights(bucket, label, callback) {
    redisReadList(bucket, 'weights', label, callback);
}

function readManyWeights(bucket, nclasses, callback) {
    redisReadManyLists(bucket, 'weights', nclasses, callback);
}

function readNClasses(bucket, callback) {
    redisReadValue(bucket, 'nclasses', callback);
}

function redisReadList(bucket, field, label, callback) {

    var key = bucket + ':' + field + ':' + label;

    redis.lrange(key, 0, -1, function(err, data) {
        callback(data);
    });
}

function redisReadManyLists(bucket, field, nclasses, callback) {
    
    var multi = redis.multi();

    for(var i = 0; i < nclasses; i++) {
        var key = bucket + ':' + field + ':' + i;
        multi.lrange(key, 0, -1);
    }

    return multi.exec(function(err, value) {
        callback(value);
    });

}

function redisReadValue(bucket, field, callback) {
    var key = bucket + ':' + field;
    return redis.get(key, function(err, value) {
        callback(value);
    });
}
