(function (win, doc, Class, exports) {

    var EventDispatcher = Class.extend({

        /**
         *  @param {string}   typ
         *  @param {?Object=} opt_evt
         *  @return {void}
         */
        trigger: function (typ, opt_evt) {

            if (!typ) {
                throw "INVALID EVENT TYPE " + typ;
            }
            
            var obj = this.handlers || (this.handlers = {}),
                arr = [].concat(obj[typ] || []), //Use copy
                evt = opt_evt || {},
                len, i, fnc;
                
            evt.type || (evt.type = typ);
            
            // handle specified event type
            for (i = 0, len = arr.length; i < len; ++i) {
                (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, this, evt);
            }
            
            // handle wildcard "*" event
            arr  = obj["*"] || [];
            for (i = 0, len = arr.length; i < len; ++i) {
                (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, this, evt);
            }
        },

        /**
         *  @param {string} typ
         *  @param {function(evt:Object):void} fnc
         *  @param {Object} [context] if would like to be called context is set this param.
         *  @return {void}
         */
         on: function (typ, fnc, context) {

            if (!typ) {
                throw "on:INVALID EVENT TYPE " + typ + " " + fnc;
            }
            
            var obj = this.handlers || (this.handlers = {});
            
            (obj[typ] || (obj[typ] = [])).push([fnc, context]);
        },

        /**
         *  @param {string} typ
         *  @param {function(evt:object):void} fnc
         */
        off: function (typ, fnc) {
            if (!typ) {
                throw "off:INVALID EVENT TYPE " + typ + " " + fn;
            }
            
            var obj = this.handlers || (this.handlers = {}),
                arr = obj[typ] || [],
                i = arr.length;
                
            while(i) {
                arr[--i][0] === fnc && arr.splice(i, 1);
            }
        },

        one: function (typ, fnc, context) {
        
            var self = this;

            function _fnc() {

                self.off(typ, _fnc, context);
                fnc.apply(context || self, arguments);
            }

            this.on(typ, _fnc, context);
        }
    });

    exports.EventDispatcher = EventDispatcher;

}(window, window.document, window.Class, window));
