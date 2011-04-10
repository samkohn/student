
var MultinomialStudent = function(nclasses, nfeatures) {

    var models = [];

    for(var i = 0; i < nclasses; i++) {
        models[i] = {
            counts : student.multinomial.initialCounts(nfeatures),
            weights : student.multinomial.initialWeights(nfeatures)
        };
    }

    this.update = function(label, features) {
        models[label] = student.multinomial.update(models[label], features); 
    }

    this.classify = function(features) {
        return student.multinomial.classify(models, features);
    }

}


var MultinomialRemoteStudent = function(bucket, callback) { 

    var socket = new io.Socket('localhost', {'port' : 8000});
    socket.on('message', function(message) { callback(message); });
    socket.connect();

    this.initialize = function(nclasses, nfeatures) {

        socket.send({
            type : 'multinomial.initialize',
            data : {
                bucket : bucket,
                nclasses : nclasses,
                nfeatures : nfeatures,
            }
        });

    }

    this.update = function(label, features) { 
        socket.send({
            type : 'multinomial.update',
            data : {
                bucket : bucket,
                label : label,
                features : features,
            }
        });
    };

    this.classify = function(features) {
        socket.send({
            type : 'multinomial.classify',
            data : {
                bucket : bucket,
                features : features,
            }
        });
    };

}
