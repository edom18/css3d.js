(function(win, doc, Class, exports) {

    'use strict';

    var Camera;

    win.Float32Array = win.Float32Array || win.Array;

    /**
      Camera class
      @constructor
      @param {number} fov Field of view.
      @param {number} aspect Aspect ratio.
      @param {number} near Near clip.
      @param {number} far far clip.
      @param {Vector3} position Position vector.
      */
    Camera = Class.extend({
        init: function (fov, aspect, near, far, position) {
            this.fov = fov;
            this.aspect = aspect;
            this.near = near;
            this.far = far;
            this.position = position != null ? position : new Vector3(0, 0, 20);

            this._super.apply(this, arguments);

            this.lookAtMatrix = new Matrix4;
            this.viewMatrix = new Matrix4;
            this.projectionMatrix = new Matrix4;
        },

        getProjectionMatrix: function() {
            return Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
        },

        updateProjectionMatrix: function() {
            this.updateLookAt();
            return this.projectionMatrix.perspectiveLH(this.fov, this.aspect, this.near, this.far);
        },

        updateLookAt: (function() {
            var lm, previous;
            lm = new Matrix4;
            previous = null;
            return function() {
                if (!previous) {
                    previous = this.position.clone();
                }
                if (this.position.equal(previous)) {
                    return;
                }
                if (!this.lookAtLock) {
                    this.target.add(this.position.clone().sub(previous));
                }
                this.lookAt();
                return previous = this.position.clone();
            };
        })(),

        lookAt: (function() {
            var m1;
            m1 = new Matrix4;
            return function(target) {
                this.target = target || this.target || new Vector3;
                m1.lookAt(this.position, this.target, this.up);
                return this.viewMatrix.copy(m1);
            };
        })()
    });


    /*! -------------------------------------------------------------
        EXPORTS.
    ----------------------------------------------------------------- */
    exports.Matrix4 = Matrix4;
    exports.Camera  = Camera;

}(window, window.document, window.Class, window));
