(function(win, doc, Class, exports) {

    'use strict';
    /**
      Vector3 class
      @constructor
      @param {number} x Position of x.
      @param {number} y Position of y.
      @param {number} z Position of z.
      */
    var Vector3 = Class.extend({
        init: function (x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        },

        zero: function () {
            this.x = this.y = this.z = 0;
            return this;
        },

        equal: function (v) {
            return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
        },

        set: function (x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            return this;
        },

        sub: function (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        },

        subVectors: function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        },

        add: function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        },

        addVectors: function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        },

        copy: function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        },

        norm: function () {
            return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },

        normalize: function () {
            var nrm = this.norm();

            if (nrm !== 0) {
                nrm = 1 / nrm;
                this.x *= nrm;
                this.y *= nrm;
                this.z *= nrm;
            }

            return this;
        },

        multiply: function (v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        },

        multiplyScalar: function (s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
            return this;
        },

        multiplyVectors: function (a, b) {
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;
            return this;
        },

        dot: function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        },

        cross: function (v, w) {
            var x, y, z;
            if (w) {
                return this.crossVectors(v, w);
            }
            x = this.x;
            y = this.y;
            z = this.z;
            this.x = (y * v.z) - (z * v.y);
            this.y = (z * v.x) - (x * v.z);
            this.z = (x * v.y) - (y * v.x);
            return this;
        },

        crossVectors: function (v, w) {
            this.x = (w.y * v.z) - (w.z * v.y);
            this.y = (w.z * v.x) - (w.x * v.z);
            this.z = (w.x * v.y) - (w.y * v.x);
            return this;
        },

        applyMatrix4: function (m) {
            var e, x, y, z;
            e = m.elements;
            x = this.x;
            y = this.y;
            z = this.z;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
            return this;
        },

        /**
          * 射影投影座標変換

          * 計算された座標変換行列をスクリーンの座標系に変換するために計算する
          * 基本はスケーリング（&Y軸反転）と平行移動。
          * 行列で表すと
          * w = width  / 2
          * h = height / 2
          * とすると
          * |w  0  0  0|
          * M(screen) = |0 -h  0  0|
          * |0  0  1  0|
          * |w  h  0  1|

          * 4x4の変換行列を対象の1x4行列[x, y, z, 1]に適用する
          * 1x4行列と4x4行列の掛け算を行う

          * |@_11 @_12 @_13 @_14|   |x|
          * |@_21 @_22 @_23 @_24| x |y|
          * |@_31 @_32 @_33 @_34|   |z|
          * |@_41 @_42 @_43 @_44|   |1|

          * @_4nは1x4行列の最後が1のため、ただ足すだけになる

          * @param {Array.<number>} out
          * @param {number} x
          * @param {number} y
          * @param {number} z
          */
        applyProjection: function (m, out) {
            var e, w, x, y, z, _w, _x, _y, _z;

            x = this.x;
            y = this.y;
            z = this.z;
            e = m.elements;
            w = e[3] * x + e[7] * y + e[11] * z + e[15];
            _w = 1 / w;
            _x = e[0] * x + e[4] * y + e[8] * z + e[12];
            _y = e[1] * x + e[5] * y + e[9] * z + e[13];
            _z = e[2] * x + e[6] * y + e[10] * z + e[14];

            if (!(((-w <= _x && _x <= w)) || ((-w <= _y && _y <= w)) || ((-w <= _z && _z <= w)))) {
                return false;
            }

            this.x = _x * _w;
            this.y = _y * _w;
            this.z = _z * _w;
            out[0] = this;
            out[1] = w;
            return this;
        },

        clone: function () {
            var vec3 = new Vector3();
            vec3.copy(this);
            return vec3;
        },

        toArray: function () {
            return [this.x, this.y, this.z];
        },

        toString: function () {
            return "" + this.x + "," + this.y + "," + this.z;
        }
    });

    /*! -------------------------------------------------------------
        EXPORTS.
    ----------------------------------------------------------------- */
    exports.Vector3 = Vector3;

}(window, window.document, window.Class, window));
