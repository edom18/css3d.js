(function (win, doc, Class, ns) {

    /**
     * Gives a disposal function.
     * @constructor
     */
    var Disposable = Class.extend({
        dispose: function () {
            if (this.isDisposed()) {
                throw new Error('This module has been disposed.');
            }

            this._disposed = true;
        },
        isDisposed: function () {
            return this._disposed;
        }
    });


    /*! ---------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    ns.Disposable = Disposable;

}(window, window.document, window.Class, window));
