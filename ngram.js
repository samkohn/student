
var ngram = {

    dict : function(tokens, gramsize) {

        dict = {}

        for(var i = 0; i < tokens.length; i++) {
            for(var len = 1; len <= gramsize; len++) {
                var gram = tokens.slice(i, i+len);
                dict[gram.join(";;;")] = gram;
            } 
        }

        grams = [];
        for(gram in dict) {
            grams.push(dict[gram]);
        }

        return grams;

    },


    features : function(tokens, dict, gramsize) { 

        feats = [];

        hsh = {}
        for(var i = 0; i < dict.length; i++) {

            feats[i] = 0;

            var gram = dict[i];

            for(var j = 0; j < tokens.length; j++) {
                var qgram = tokens.slice(j, j + gram.length);
                if(this.listEq(gram, qgram)) {
                    feats[i] += 1;
                }
            }

        }

        return feats;

    },

    listEq : function(l1, l2) {

        if(l1.length != l2.length)
            return false;

        for(var i = 0; i < l1.length; i++) {
            if(l1[i] != l2[i])
                return false;
        }

        return true;

    }
}

if(typeof(exports) != 'undefined')
    exports.ngram = ngram;
