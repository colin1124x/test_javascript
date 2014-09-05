
(function(factory){
    var id = 'configuration';
    if (typeof define === 'function' && define.amd) {
        define(id, [], factory);
    } else {
        self[id] = factory();
    }
})(function(undef){ 'use strict';

    var hasOwn = ({}).hasOwnProperty;

    function configuration(config)
    {
        //預設值
        config = (typeof config == 'object') ? config : {};

        var obj = this;

        obj.set = function(){
            if (2 === arguments.length && typeof arguments[0] == 'string') {

                var prop_name = arguments[0];

                if (hasOwn.call(config, prop_name)) {
                    config[prop_name] = arguments[1];
                } else {
                    throw new Error('config has no such property [' + prop_name + ']');
                }

            } else if (typeof arguments[0] == 'object') {
                var sets = arguments[0];

                for (var n in sets) {
                    if (hasOwn.call(sets, n)) {
                        obj.set(n, sets[n]);
                    }
                }
            } else {
                throw new Error('use set(name, val) or set(object)');
            }

            return obj;
        };


        obj.get = function(name)
        {
            if (typeof name != 'string') {
                throw new Error('prop name must be string');
            }

            return hasOwn.call(config, name) ? config[name] : undef;
        };
    }

    return configuration;
});
