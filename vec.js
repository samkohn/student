var vec =  {

    vsum : function(v1, v2) {

        if(v1.length != v2.length)
            return null;

        r = [];

        for(var i = 0; i < v1.length; i++) {
            r[i] = parseFloat(v1[i]) + parseFloat(v2[i]);
        }

        return r;
    },

    vdot : function(v1, v2) {
        
        if(v1.length != v2.length)
            return null;

        r = [];

        for(var i = 0; i < v1.length; i++) {
            r[i] = parseFloat(v1[i]) * parseFloat(v2[i]);
        }

        return this.sum(r);

    },

    ssum : function(c, v) {

        r = [];

        for(var i = 0; i < v.length; i++) {
            r[i] = parseFloat(c) + parseFloat(v[i]);
        }

        return r;
    },

    sdot : function(c, v) {

        r = [];

        for(var i = 0; i < v.length; i++) {
            r[i] = parseFloat(c) * parseFloat(v[i]);
        }

        return r;
    },

    vlog : function(v) { 

        r = [];

        for(var i = 0; i < v.length; i++) {
            r[i] = Math.log(parseFloat(v[i]));
        }

        return r;
    },

    sum : function(v) {
        return v.reduce(function(prev, curr) {
            return parseFloat(prev) + parseFloat(curr);
        });
    },

    fill : function(n, val) {
        r = [];
        for(var i = 0; i < n; i++) {
            r[i] = val;
        }
        return r;
    },

    ones : function(n) {
        return this.fill(n, 1);
    },

    zeros : function(n) {
        return this.fill(n, 0);
    },

    rand : function(n) {
        r = [];
        for(var i = 0; i < n; i++) {
            r[i] = Math.rand();
        }
    }

}

if(typeof(exports) != 'undefined')
    exports.vec = vec;
