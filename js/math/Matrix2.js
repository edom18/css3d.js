(function(win, doc, Class, exports) {

    'use strict';

    /**
     * Matrix2 class
     * @constructor
     */
    var Matrix2 = Class.extend({
        init: function (m11, m12, m21, m22) {
            var te;
            if (m11 == null) {
                m11 = 1;
            }
            if (m12 == null) {
                m12 = 0;
            }
            if (m21 == null) {
                m21 = 0;
            }
            if (m22 == null) {
                m22 = 1;
            }
            this.elements = te = new Float32Array(4);
            te[0] = m11;
            te[2] = m12;
            te[1] = m21;
            te[3] = m22;
        },

        /**
         * 逆行列を生成
         * [逆行列の公式]
         * A = |a b|
         * |c d|
         * について、detA = ad - bc ≠0のときAの逆行列が存在する
         * A^-1 = | d -b| * 1 / detA
         * |-c  a|
         */
        getInvert: function () {

            var det, oe, out, te;

            out = new Matrix2();
            oe = out.elements;
            te = this.elements;
            det = te[0] * te[3] - te[2] * te[1];

            if ((0.0001 > det && det > -0.0001)) {
                return null;
            }

            oe[0] = te[3] / det;
            oe[1] = -te[1] / det;
            oe[2] = -te[2] / det;
            oe[3] = te[0] / det;

            return out;
        }
    });

    /*! -------------------------------------------------------------
        EXPORTS.
    ----------------------------------------------------------------- */
    exports.Matrix2 = Matrix2;

}(window, window.document, window.Class, window));
