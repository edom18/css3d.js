(function(win, doc, Class, exports) {

    'use strict';

    //import math class.
    var max  = Math.max,
        min  = Math.min,
        sqrt = Math.sqrt,
        tan  = Math.tan,
        cos  = Math.cos,
        sin  = Math.sin,
        PI   = Math.PI;

    /**
      * Matrix4 class
      * @constructor
      * @param {boolean} cpy
      */
    var Matrix4 = Class.extend({
        init: function (cpy) {
            this.elements = new Float32Array(16);

            if (cpy) {
                this.copy(cpy);
            }
            else {
                this.identity();
            }
        },

        identity: function () {
            var te = this.elements;

            te[0] = 1; te[4] = 0; te[8]  = 0; te[12] = 0;
            te[1] = 0; te[5] = 1; te[9]  = 0; te[13] = 0;
            te[2] = 0; te[6] = 0; te[10] = 1; te[14] = 0;
            te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

            return this;
        },

        /**
         * Equal evolution.
         * @param {Matrix4} m To be compired matrix.
         * @return {Matrix4} this
         */
        equal: function (m) {
            var te = this.elements,
                me = m.elements;

            for (var i = 0, l = te.length; i < l; i++) {
                if (te[i] !== me[i]) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Return inverse matrix to `dest`
         * @param {Matrix4} dest
         */
        inverse: function (dest) {

            var a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44,
                b11, b12, b13, b14, b21, b22, b23, b24, b31, b32, b33, b34, b41, b42, b43, b44,
                det, de, dest, te;

            dest = new Matrix4();
            de = dest.elements;
            te = this.elements;

            a11 = te[0]; a12 = te[4]; a13 = te[8];  a14 = te[12];
            a21 = te[1]; a22 = te[5]; a23 = te[9];  a24 = te[13];
            a31 = te[2]; a32 = te[6]; a33 = te[10]; a34 = te[14];
            a41 = te[3]; a42 = te[7]; a43 = te[11]; a44 = te[15];

            det = (
                a11 * a22 * a33 * a44 +
                a11 * a23 * a34 * a42 +
                a11 * a24 * a32 * a43 +
                a12 * a21 * a34 * a43 +
                a12 * a23 * a31 * a44 +
                a12 * a24 * a33 * a41 +
                a13 * a21 * a32 * a44 +
                a13 * a22 * a34 * a41 +
                a13 * a24 * a31 * a42 +
                a14 * a21 * a33 * a42 +
                a14 * a22 * a31 * a43 +
                a14 * a23 * a32 * a41 -
                a11 * a22 * a34 * a43 -
                a11 * a23 * a32 * a44 -
                a11 * a24 * a33 * a42 -
                a12 * a21 * a33 * a44 -
                a12 * a23 * a34 * a41 -
                a12 * a24 * a31 * a43 -
                a13 * a21 * a34 * a42 -
                a13 * a22 * a31 * a44 -
                a13 * a24 * a32 * a41 -
                a14 * a21 * a32 * a43 -
                a14 * a22 * a33 * a41 -
                a14 * a23 * a31 * a42
            );

            if ((0.0001 > det && det > -0.0001)) {
                return null;
            }

            b11 = ((a22 * a33 * a44) + (a23 * a34 * a42) + (a24 * a32 * a43) - (a22 * a34 * a43) - (a23 * a32 * a44) - (a24 * a33 * a42)) / det;
            b12 = ((a12 * a34 * a43) + (a13 * a32 * a44) + (a14 * a33 * a42) - (a12 * a33 * a44) - (a13 * a34 * a42) - (a14 * a32 * a43)) / det;
            b13 = ((a12 * a23 * a44) + (a13 * a24 * a42) + (a14 * a22 * a43) - (a12 * a24 * a43) - (a13 * a22 * a44) - (a14 * a23 * a42)) / det;
            b14 = ((a12 * a24 * a33) + (a13 * a22 * a34) + (a14 * a23 * a32) - (a12 * a23 * a34) - (a13 * a24 * a32) - (a14 * a22 * a33)) / det;
            b21 = ((a21 * a34 * a43) + (a23 * a31 * a44) + (a24 * a33 * a41) - (a21 * a33 * a44) - (a23 * a34 * a41) - (a24 * a31 * a43)) / det;
            b22 = ((a11 * a33 * a44) + (a13 * a34 * a41) + (a14 * a31 * a43) - (a11 * a34 * a43) - (a13 * a31 * a44) - (a14 * a33 * a41)) / det;
            b23 = ((a11 * a24 * a43) + (a13 * a21 * a44) + (a14 * a23 * a41) - (a11 * a23 * a44) - (a13 * a24 * a41) - (a14 * a21 * a43)) / det;
            b24 = ((a11 * a23 * a34) + (a13 * a24 * a31) + (a14 * a21 * a33) - (a11 * a24 * a33) - (a13 * a21 * a34) - (a14 * a23 * a31)) / det;
            b31 = ((a21 * a32 * a44) + (a22 * a34 * a41) + (a24 * a31 * a42) - (a21 * a34 * a42) - (a22 * a31 * a44) - (a24 * a32 * a41)) / det;
            b32 = ((a11 * a34 * a42) + (a12 * a31 * a44) + (a14 * a32 * a41) - (a11 * a32 * a44) - (a12 * a34 * a41) - (a14 * a31 * a42)) / det;
            b33 = ((a11 * a22 * a44) + (a12 * a24 * a41) + (a14 * a21 * a42) - (a11 * a24 * a42) - (a12 * a21 * a44) - (a14 * a22 * a41)) / det;
            b34 = ((a11 * a24 * a32) + (a12 * a21 * a34) + (a14 * a22 * a31) - (a11 * a22 * a34) - (a12 * a24 * a31) - (a14 * a21 * a32)) / det;
            b41 = ((a21 * a33 * a42) + (a22 * a31 * a43) + (a23 * a32 * a41) - (a21 * a32 * a43) - (a22 * a33 * a41) - (a23 * a31 * a42)) / det;
            b42 = ((a11 * a32 * a43) + (a12 * a33 * a41) + (a13 * a31 * a42) - (a11 * a33 * a42) - (a12 * a31 * a43) - (a13 * a32 * a41)) / det;
            b43 = ((a11 * a23 * a42) + (a12 * a21 * a43) + (a13 * a22 * a41) - (a11 * a22 * a43) - (a12 * a23 * a41) - (a13 * a21 * a42)) / det;
            b44 = ((a11 * a22 * a33) + (a12 * a23 * a31) + (a13 * a21 * a32) - (a11 * a23 * a32) - (a12 * a21 * a33) - (a13 * a22 * a31)) / det;

            de[0]  = b11; de[4]  = b12; de[8]  = b13; de[12] = b14;
            de[1]  = b21; de[5]  = b22; de[9]  = b23; de[13] = b24;
            de[2]  = b31; de[6]  = b32; de[10] = b33; de[14] = b34;
            de[3]  = b41; de[7]  = b42; de[11] = b43; de[15] = b44;

            return dest;
        },

        /**
         * Copy from `m`
         * @param {Matrix4} m
         * @return {Matrix4} this
         */
        copy: function (m) {
            var me, te;
            te = this.elements;
            me = m.elements;

            te[0] = me[0]; te[4] = me[4]; te[8]  = me[8];  te[12] = me[12];
            te[1] = me[1]; te[5] = me[5]; te[9]  = me[9];  te[13] = me[13];
            te[2] = me[2]; te[6] = me[6]; te[10] = me[10]; te[14] = me[14];
            te[3] = me[3]; te[7] = me[7]; te[11] = me[11]; te[15] = me[15];

            return this;
        },

        makeFrustum: function (left, right, bottom, top, near, far) {
            var a, b, c, d, te, vh, vw, x, y;

            te = this.elements;
            vw = right - left;
            vh = top - bottom;
            x = 2 * near / vw;
            y = 2 * near / vh;
            a = (right + left) / (right - left);
            b = (top + bottom) / (top - bottom);
            c = -(far + near) / (far - near);
            d = -(2 * near * far) / (far - near);

            te[0] = x; te[4] = 0; te[8]  =  a; te[12] = 0;
            te[1] = 0; te[5] = y; te[9]  =  b; te[13] = 0;
            te[2] = 0; te[6] = 0; te[10] =  c; te[14] = d;
            te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;

            return this;
        },

        perspectiveLH: function (fov, aspect, near, far) {
            var tmp = Matrix4.perspectiveLH(fov, aspect, near, far);
            return this.copy(tmp);
        },

        /**
         * Multiple matrix this times A.
         * @param {Matrix4} A multiple matrix.
         * @return {Matrix4} this
         */
        multiply: function (A) {
            var tmp = Matrix4.multiply(this, A);
            this.copy(tmp);
            return this;
        },

        /**
         * Multiply Matrices
         * A, Bふたつの行列の掛け算した結果をthisに保存
         * @param {Matrix4} A.
         * @param {Matrix4} B.
         */
        multiplyMatrices: function (A, B) {
            var tmp = Matrix4.multiply(A, B);
            this.copy(tmp);
            return this;
        },

        /**
         * @param {Vector3} v
         */
        translate: function (v) {
            var te, x, y, z;

            te = this.elements;
            x = v.x;
            y = v.y;
            z = v.z;

            te[0] = 1; te[4] = 0; te[8]  = 0; te[12] = x;
            te[1] = 0; te[5] = 1; te[9]  = 0; te[13] = y;
            te[2] = 0; te[6] = 0; te[10] = 1; te[14] = z;
            te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

            return this;
        },

        /**
         * Scale matrix
         * @param {Vector3} v
         */
        scale: function (v) {
            var te, x, y, z;

            te = this.elements;
            x = v.x;
            y = v.y;
            z = v.z;

            te[0] = x; te[4] = 0; te[8]  = 0; te[12] = 0;
            te[1] = 0; te[5] = y; te[9]  = 0; te[13] = 0;
            te[2] = 0; te[6] = 0; te[10] = z; te[14] = 0;
            te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

            return this;
        },

        /**
         * Look at target from eye.
         * @param {Vector3} eye
         * @param {Vector3} target
         * @param {Vector3} up
         * @return {Matrix4} this
         */
        lookAt: (function() {

            var x = new Vector3(),
                y = new Vector3(),
                z = new Vector3();

            return function(eye, target, up) {
                var te, tx, ty, tz;

                te = this.elements;

                z.subVectors(eye, target).normalize();
                x.crossVectors(z, up).normalize();
                y.crossVectors(x, z).normalize();

                tx = eye.dot(x);
                ty = eye.dot(y);
                tz = eye.dot(z);

                te[0] = x.x; te[4] = x.y; te[8]  = x.z; te[12] = -tx;
                te[1] = y.x; te[5] = y.y; te[9]  = y.z; te[13] = -ty;
                te[2] = z.x; te[6] = z.y; te[10] = z.z; te[14] = -tz;

                return this;
            };
        })(),

        /**
         * Create a rotation with X axis.
         * @param {number} r Rotate X
         * @return {Matrix4} this
         */
        rotateX: function (r) {
            var c, s, te;

            te = this.elements;
            c = cos(r);
            s = sin(r);

            te[0] = 1; te[4] = 0; te[8]  =  0; te[12] = 0;
            te[1] = 0; te[5] = c; te[9]  = -s; te[13] = 0;
            te[2] = 0; te[6] = s; te[10] =  c; te[14] = 0;
            te[3] = 0; te[7] = 0; te[11] =  0; te[15] = 1;

            return this;
        },

        /**
         * Create a rotation with Y axis.
         * @param {number} r Rotate Y
         * @return {Matrix4} this
         */
        rotateY: function (r) {
            var c, s, te;

            te = this.elements;
            c = cos(r);
            s = sin(r);

            te[0] =  c; te[4] = 0; te[8]  = s; te[12] = 0;
            te[1] =  0; te[5] = 1; te[9]  = 0; te[13] = 0;
            te[2] = -s; te[6] = 0; te[10] = c; te[14] = 0;
            te[3] =  0; te[7] = 0; te[11] = 0; te[15] = 1;

            return this;
        },

        /**
         * Create a rotation with Z axis.
         * @param {number} r Rotate Z
         * @return {Matrix4} this
         */
        rotateZ: function (r) {
            var c, s, te;
            te = this.elements;

            c = cos(r);
            s = sin(r);

            te[0] = c; te[4] = -s; te[8]  = 0; te[12] = 0;
            te[1] = s; te[5] =  c; te[9]  = 0; te[13] = 0;
            te[2] = 0; te[6] =  0; te[10] = 1; te[14] = 0;
            te[3] = 0; te[7] =  0; te[11] = 0; te[15] = 1;

            return this;
        },

        /**
         * Create rotation matrix with any axis.
         * @return {Matrix4} this
         */
        rotate: function (r, axis) {

            var x = axis.x, y = axis.y, z = axis.z;
            var sq = sqrt(x * x + y * y + z * z);

            if(!sq){
                return null;
            }

            if(sq !== 1){
                sq = 1 / sq;
                x *= sq;
                y *= sq;
                z *= sq;
            }

            var co = cos(r),
                si = sin(r),
                a = (1 - co),
                b = x * x,
                c = y * y,
                d = z * z,
                e = x * y,
                f = x * z,
                g = y * z,
                h = x * si,
                i = y * si,
                j = z * si;

            var te = this.elements;
            te[0] = b * a + co; te[4] = e * a - j;  te[8]  = f * a + i;
            te[1] = e * a + j;  te[5] = c * a + co; te[9]  = g * a - h;
            te[2] = f * a - i;  te[6] = g * a + h;  te[10] = d * a + co;

            return this;
        },

        /**
         * Create clone from this matrix.
         * @return {Matrix4} cloned matrix.
         */
        clone: function() {
            var tmp = new Matrix4();
            tmp.copy(this);
            return tmp;
        }
    });

    /**
     * Create a perspective
     * @param {number} fov field of view.
     * @param {number} aspect aspect ratio.
     * @param {number} near near clip face.
     * @param {number} far far clip face.
     */
    Matrix4.perspectiveLH = function (fov, aspect, near, far) {
        var te, tmp, xmax, xmin, ymax, ymin;
        tmp = new Matrix4();
        te = tmp.elements;

        ymax = near * tan(fov * DEG_TO_RAD * 0.5);
        ymin = -ymax;
        xmin = ymin * aspect;
        xmax = ymax * aspect;

        return tmp.makeFrustum(xmin, xmax, ymin, ymax, near, far);
    };

    /**
     * Multiple matrix A x B.
     * @param {Matrix4} A
     * @param {Matrix4} B
     * @return {Matrix4} result matrix.
     */
    Matrix4.multiply = function (A, B) {

        var A11, A12, A13, A14, A21, A22, A23, A24, A31, A32, A33, A34, A41, A42, A43, A44,
            B11, B12, B13, B14, B21, B22, B23, B24, B31, B32, B33, B34, B41, B42, B43, B44,
            ae, be, te, tmp;

        ae = A.elements;
        be = B.elements;

        A11 = ae[0]; A12 = ae[4]; A13 = ae[8]; A14  = ae[12];
        A21 = ae[1]; A22 = ae[5]; A23 = ae[9]; A24  = ae[13];
        A31 = ae[2]; A32 = ae[6]; A33 = ae[10]; A34 = ae[14];
        A41 = ae[3]; A42 = ae[7]; A43 = ae[11]; A44 = ae[15];

        B11 = be[0]; B12 = be[4]; B13 = be[8]; B14  = be[12];
        B21 = be[1]; B22 = be[5]; B23 = be[9]; B24  = be[13];
        B31 = be[2]; B32 = be[6]; B33 = be[10]; B34 = be[14];
        B41 = be[3]; B42 = be[7]; B43 = be[11]; B44 = be[15];

        tmp = new Matrix4();
        te = tmp.elements;

        te[0]  = A11 * B11 + A12 * B21 + A13 * B31 + A14 * B41;
        te[4]  = A11 * B12 + A12 * B22 + A13 * B32 + A14 * B42;
        te[8]  = A11 * B13 + A12 * B23 + A13 * B33 + A14 * B43;
        te[12] = A11 * B14 + A12 * B24 + A13 * B34 + A14 * B44;
        te[1]  = A21 * B11 + A22 * B21 + A23 * B31 + A24 * B41;
        te[5]  = A21 * B12 + A22 * B22 + A23 * B32 + A24 * B42;
        te[9]  = A21 * B13 + A22 * B23 + A23 * B33 + A24 * B43;
        te[13] = A21 * B14 + A22 * B24 + A23 * B34 + A24 * B44;
        te[2]  = A31 * B11 + A32 * B21 + A33 * B31 + A34 * B41;
        te[6]  = A31 * B12 + A32 * B22 + A33 * B32 + A34 * B42;
        te[10] = A31 * B13 + A32 * B23 + A33 * B33 + A34 * B43;
        te[14] = A31 * B14 + A32 * B24 + A33 * B34 + A34 * B44;
        te[3]  = A41 * B11 + A42 * B21 + A43 * B31 + A44 * B41;
        te[7]  = A41 * B12 + A42 * B22 + A43 * B32 + A44 * B42;
        te[11] = A41 * B13 + A42 * B23 + A43 * B33 + A44 * B43;
        te[15] = A41 * B14 + A42 * B24 + A43 * B34 + A44 * B44;

        return tmp;
    };

    /*! -------------------------------------------------------------
        EXPORTS.
    ----------------------------------------------------------------- */
    exports.Matrix4 = Matrix4;

}(window, window.document, window.Class, window));
