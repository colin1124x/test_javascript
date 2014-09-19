define(function(){

//    if (window.Promise) {
//        return Promise;
//    }

    function isCallable(func) {
        return typeof func == 'function';
    }

    function resolve_queues(queues) {
        while (queues.length) {
            (queues.shift())();
        }
    }

    var Promise = function(callback){

        if (typeof callback != 'function') {
            throw new Error('arg 1 must be a function');
        }

        var o = this,
            arg = null,
            queues = [],
            resolve;

        o.then = function(fulfill, reject){

            if (null === arg) {
                queues.push(function(){o.then(fulfill, reject);});
            } else {
                if (o === resolve) {
                    return o;
                }

                if (resolve && isCallable(resolve.then)) {
                    return resolve.then(fulfill, reject);
                }

                if (isCallable(arguments[arg])) {
                    try {
                        resolve = arguments[arg](resolve);
                    } catch (e) {
                        resolve = e;
                    }
                }
            }

            return o;
        };

        setTimeout(function(){
            callback(function(v){
                if (null === arg) {
                    resolve = v;
                    arg = 0;
                    resolve_queues(queues);
                }
            }, function(e){
                if (null === arg) {
                    resolve = e;
                    arg = 1;
                    resolve_queues(queues);
                }
            });
        }, 5);

        return o;
    };

    Promise.resolve = function(val){
        if (val instanceof Promise) {
            return val;
        }

        return new Promise(function(fulfill){
            fulfill(val);
        });
    };

    Promise.reject = function(error){
        if (error instanceof Promise) {
            return error;
        }

        return new Promise(function(fulfill, reject){
            reject(error);
        });
    };

    Promise.all = function(promises){
        var arr = [],
            ready = new Promise(function(f){f(arr);});

        promises.forEach(function(_p){
            ready = ready.then(function(x){
                return _p;
            }).then(function(v){
                arr.push(v);
            });
        });

        return ready.then(function(){
            return arr;
        });
    };

    return Promise;
});