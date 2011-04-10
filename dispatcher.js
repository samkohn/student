exports.createDispatcher = function createDispatcher() {

    return new function() {

        this.listeners = {};

        // register a callback to receive events of a given type
        this.register = function(mtype, callback) {
            // create a listener list for events of this type, if one doesn't
            // exist
            if(!this.listeners[mtype]) {
                this.listeners[mtype] = [];
            }
            // add the new listener to the list
            this.listeners[mtype].push(callback);
        };

        // send a message to all registered listeners
        this.dispatch = function(message, client) {
            if(!this.listeners[message.type]) {
                return;
            }
            this.listeners[message.type].every(function(callback) {
                callback(message, client);
            });
        };

    };

}
