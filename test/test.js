(function () {

    var assert = require("assert");

    describe('Math 3D system test.', function() {

        var m = new matIV();
        var mat4  = new Matrix4();

        function checkArray(a, b) {
            for (var i = 0, l = a.length; i < l; i++) {
                assert.equal(a[i], b[i]);
            }
        }

        describe('Matrix4 test', function () {

            var baseMat1 = null;
            var baseMat2 = null;
            var baseMat3 = null;

            beforeEach(function () {
                baseMat1 = m.identity(m.create());
                baseMat2 = new Matrix4();
                baseMat3 = new Matrix4();
            });

            it('rotate(x-axis) equal rotateX', function () {
                var angle = 45 * Math.PI / 180;
                var axis = new Vector3([1.0, 0.0, 0.0]);
                m.rotate(baseMat1, angle, axis, baseMat1);
                m.inverse(baseMat1, baseMat1);

                baseMat2.rotateX(angle);
                baseMat3.rotate(angle, axis);

                checkArray(baseMat2.elements, baseMat3.elements);
            });

            it('rotate(y-axis) equal rotateY', function () {
                var angle = 45 * Math.PI / 180;
                var axis = new Vector3([0.0, 1.0, 0.0]);
                m.rotate(baseMat1, angle, axis, baseMat1);
                m.inverse(baseMat1, baseMat1);

                baseMat2.rotateY(angle);
                baseMat3.rotate(angle, axis);

                checkArray(baseMat2.elements, baseMat3.elements);
            });

            it('rotate(z-axis) equal rotateZ', function () {
                var angle = 45 * Math.PI / 180;
                var axis = new Vector3([0.0, 0.0, 1.0]);
                m.rotate(baseMat1, angle, axis, baseMat1);
                m.inverse(baseMat1, baseMat1);

                baseMat2.rotateZ(angle);
                baseMat3.rotate(angle, axis);

                checkArray(baseMat2.elements, baseMat3.elements);
            });

            0 && it('perspective test', function() {

                // X軸を中心として45度回転する行列を生成する例
                var angle = 45 * Math.PI / 180;
                var axis = [1.0, 0.0, 0.0];
                m.rotate(baseMat1, angle, axis, baseMat1);
                m.inverse(baseMat1, baseMat1);

                baseMat2.rotateX(angle);
                baseMat2.inverse(baseMat2);

                var e1 = baseMat1;
                var e2 = baseMat2.elements;

                //checkArray(e1, e2);
            });
        });
    });

}());
