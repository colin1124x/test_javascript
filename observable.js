//觀察模式
(function(factory){
    var id = 'observable';
    if (typeof define === 'function' && define.amd) {
        define(id, [], factory);
    } else {
        self[id] = factory();
    }
})(function(){ 'use strict';
    function clone(o, source, keys)
    {
        if ('length' in keys && source) {
            ! o && (o = {});
            for (var i=0,L=keys.length; i<L; i++) {
                var key = keys[i];
                o[key] = source[key];
            }
        }
    }
    var default_event = 'default_event';
    function observable()
    {
        var is_notice = true;
        var observers = [];

        var obj = this;

        obj.silence = function(bool)
        {
            if (typeof bool == 'undefined') {
                bool = true;
            }

            is_notice = ! bool;

            return obj;
        };

        obj.register = function()
        {
            var observer = null;
            if (arguments[0] instanceof Function) {
                observer = {
                    caller: this,
                    callback: arguments[0],
                    event: arguments[1],
                    key: arguments[2]
                };
            } else if (arguments[1] in arguments[0] && (arguments[0][arguments[1]] instanceof Function)) {
                observer = {
                    caller: arguments[0],
                    callback: arguments[0][arguments[1]],
                    event: arguments[2],
                    key: arguments[3]
                };
            }

            observer.event = observer.event || default_event;

            if (observer) {
                var exists = false;
                for (var i = 0, L = observers.length; i < L; ++i) {
                    var _obs = observers[i];
                    if (_obs.callback == observer.callback) {
                        exists = true;
                        break;
                    }
                }
                ! exists && observers.push(observer);
            }

            return obj;
        };

        obj.notice = function(data, event)
        {
            event = event || default_event;
            var retval = true;
            if (observers && is_notice) {
                for (var i=0, L=observers.length; i<L; i++) {
                    var o = observers[i].caller,
                         m = observers[i].callback,
                         k = observers[i].key,
                         e = observers[i].event,
                         type_k = typeof k;
                    var ret = {};
                    if (event === e) {
                        if ('string' == type_k) {
                            ret = data[k];
                        } else if ('undefined' == type_k) {
                            ret = data;
                        } else if ('length' in k) {
                            clone(ret, data, k);
                        }
                        if (m) {
                            try {
                                if (false === m.call(o, ret)) {
                                    retval = false;
                                }
                            } catch (exception) {
                                if (self.console) {
                                    console.log( m, exception.stack);
                                } else {
                                    alert(Lang('debugMsg')+': ' + exception.message);
                                }
                            }
                        }
                    }
                }
            }

            return retval;
        };
    }

    return observable;
});