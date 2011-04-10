
if(typeof(require) !== 'undefined')
    var vec = require('./vec.js').vec

var student = {

    multinomial : {

        initialCounts : function(nfeatures) {
            return vec.ones(nfeatures);
        },

        initialWeights : function(nfeatures) {
            return vec.fill(nfeatures, -Math.log(nfeatures));
        },

        update : function(model, features) {

            var newcounts = vec.vsum(model.counts, features);
            var newsum = vec.sum(newcounts);
            var newweights = vec.ssum(-Math.log(newsum), vec.vlog(newcounts));

            return {
                counts : newcounts,
                weights : newweights
            };
        },

        classify : function(models, features) {
            var besti = -1,
                bestscore = -Infinity;

            for(var i = 0; i < models.length; i++) {
                var score = vec.vdot(models[i].weights, features);
                if(score > bestscore) {
                    besti = i;
                    bestscore = score;
                }
            }

            return besti;
        }

    },

    perceptron : {

        initialize : function(nfeatures) {
            return {
                weights : vec.rand(nFeatures),
                featuresMat : [],
                labels : []
            };
        },

        update : function(model, label, features) {

            newweights = model.weights;

            // TODO no side effects
            model.labels.push(label);
            model.featuresMat.push(features);

            for(var t = 0; t < 100; t++) {
                for(var i = 0; i < model.featuresMat.length; i++) {

                    var pred = vec.vdot(newweights, model.featuresMat[i]);

                    if(pred * model.labels[i] > 0) {
                        return;
                    }

                    model = vec.vsum(model, vec.cdot(labels[i], featuresMat[i]));

                }
            }

            return model;
        },

        classify : function(model, features) {
            
            return vec.vsum(model.weights, features);

        }

    }

}

if(typeof(exports) !== 'undefined')
    exports.student = student;
