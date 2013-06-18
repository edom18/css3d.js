(function (win, doc, Class, ns) {

    /**
     * An Event object.
     * This class contains some object.
     * @constructor
     */
    var EventObject = Class.extend({
        init: function (context, args, opt) {
            var stopPropagation = this.stopPropagation;
            util.copyClone(this, context, args, opt);
            this._context = context;
            this.stopPropagation = stopPropagation;
        },
        stopPropagation: function () {
            if (this._context.stopPropagation) {
                this._context.stopPropagation();
            }
            this._context._bubbleCanceled = true;
        }
    });


    /**
     * This class gives a simple event dispatch system.
     * @constructor
     */
    var EventDispatcher = Disposable.extend({

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
                evt = new EventObject(this, opt_evt, {
                    type: typ
                }),
                len, i, fnc;
            
            // handle specified event type
            for (i = 0, len = arr.length; i < len; ++i) {
                (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, evt);
            }
            
            // handle wildcard "*" event
            arr  = obj["*"] || [];
            for (i = 0, len = arr.length; i < len; ++i) {
                (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, evt);
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

            this.handlers || (this.handlers = {});

            if (!typ) {
                this.handlers = {};
                return;
            }

            if (!fnc) {
                this.handlers[typ] = [];
                return;
            }
            
            var obj = this.handlers,
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
        },

        dispose: function () {
            this._super();
            this.off();
            this.handlers = null;
        }
    });

    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */

    ns.EventDispatcher = EventDispatcher;
    ns.EventObject     = EventObject;

}(window, window.document, window.Class, window));
