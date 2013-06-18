(function(win, doc, Class, exports) {

    'use strict';

    win.Float32Array = win.Float32Array || win.Array;

    var prop_names = (function () {
        var ret = {};
        return ret;
    }());

    var Css3D = Class.extend({
        init: function () {
            this.parent = null;
            this.children = [];
            this.vertices = [];
            this.position = new Vector3();
            this.rotation = new Vector3();
            this.scale = new Vector3(1, 1, 1);
            this.up    = new Vector3(0, 1, 0);

            this.matrixScale = new Matrix4();
            this.matrixTranslate = new Matrix4();
            this.matrixRotation = new Matrix4();
            this.matrix = new Matrix4();
            this.matrixWorld = new Matrix4();

            this.updateMatrix();
        },

        updateScale: (function () {

            var sm = new Matrix4();

            return function () {
                if (this.prevScale && this.scale.equal(this.prevScale)) {
                    return false;
                }

                this.prevScale = this.scale.clone();
                this.matrixScale = sm.clone().scale(this.scale);

                return true;
            };
        }()),

        updateTranslate: (function () {

            var tm = new Matrix4();

            return function () {
                if (this.prevPosition && this.position.equal(this.prevPosition)) {
                    return false;
                }

                this.prevPosition = this.position.clone();
                this.matrixTranslate = tm.clone().translate(this.position);

                return true;
            };
        }()),

        updateRotation: (function () {

            var rmx = new Matrix4(),
                rmy = new Matrix4(),
                rmz = new Matrix4();

            return function () {

                if (this.prevRotation && this.rotation.equal(this.prevRotation)) {
                    return false;
                }

                x = this.rotation.x * DEG_TO_RAD;
                y = this.rotation.y * DEG_TO_RAD;
                z = this.rotation.z * DEG_TO_RAD;

                var tmp = new Matrix4();
                rmx.rotationX(x);
                rmy.rotationY(y);
                rmz.rotationZ(z);

                tmp.multiplyMatrices(rmx, rmy);
                tmp.multiply(rmz);

                this.prevRotation = this.rotation.clone();
                this.matrixRotation = tmp;

                return true;
            };
        }()),

        updateMatrix: function () {

            var updatedScale     = this.updateScale(),
                updatedRotation  = this.updateRotation(),
                updatedTranslate = this.updateTranslate();

            if (updatedRotation || updatedTranslate || updatedScale) {
                this.matrix.multiplyMatrices(this.matrixTranslate, this.matrixRotation);
                this.matrix.multiply(this.matrixScale);
                this.needUpdateMatrix = true;
            }
            else {
                this.needUpdateMatrix = false;
            }

            var children = this.children;
            for (var i = 0, c, l = children; i < l; i++) {
                c = children[i];
                c.updateMatrix();
            }
        },

        updateMatrixWorld: function (force) {

            if (!this.parent) {
                this.matrixWorld.copy(this.matrix);
            }
            else {
                if (force || this.parent.needUpdateMatrix || this.needUpdateMatrix || this.parent.needUpdateMatrixWorld) {
                    this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
                    this.needUpdateMatrixWorld = true;
                }
                else {
                    this.needUpdateMatrixWorld = false
                }
            }

            var children = this.children;
            for (var i = 0, c, l = children; i < l; i++) {
                c = children[i];
                c.updateMatrixWorld();
            }
        },

        getVerticesByProjectionMatrix: function (m) {

            var ret = [],
                wm,
                tmp,
                outside,
                vertices = this.vertices;

            for (var i = 0, v, l = vertices.length; i < l; i++) {
                v = vertices[i];
                wm = Matrix4.multiply(m, this.matrixWorld);
                tmp = [];
                outside = v.clone().applyProjection(wm, tmp);

                if (!outside) {
                    continue;
                }

                ret = ret.concat(tmp[0].toArray().concat(tmp[1]));
            }

            return ret;
        },

        add: function (object) {
             if (this === object) {
                 return null;
             }

            object.parent && object.parent.remove(object);

            this.children.push(object);
            object.parent = this;
        },

        remove: function (object) {
            if (this === object) {
                return null;
            }

            index = this.children.indexOf(object);

            if (index === -1) {
                return null;
            }

            return this.children.splice(index, 1);
        }
    });

    /**
     * Renderer class
     * @class
     * @constructor
     */
    var Renderer = Class.extend({
        render: function (camera, scene) {
        
        }
    });


    var Scene = Class.extend({
        init: function () {
            this.materials = [];
        },

        add: function (material) {
            if (material instanceof Css3D) {
                this.materials.push(material);
            }
        },

        update: function () {
            var materials = this.materials;
            for (var i = 0, m, l = materials; i < l; i++) {
                m = materials[i];
                m.updateMatrix()
                m.updateMatrixWorld()
            }
        }
    });

    /**
      Camera class
      @constructor
      @param {number} perspective
      @param {Vector3} position Position vector.
      */
    var Camera = Class.extend({
        defaults: {
            perspective: 300,
            position: new Vector3(0, 0, 20)
        },
        init: function (args) {
            args || (args = {});

            this.perspective = args.perspective || this.defaults.perspective;
            this.position = args.position || this.defaults.position;

            this.lookAtMatrix     = new Matrix4();
            this.viewMatrix       = new Matrix4();
            this.projectionMatrix = new Matrix4();

            this.viewport = args.viewport || this._createElement();
            this._setup();
        },

        _setup: function () {
            this.viewport.style.webkitPerspective = this.perspective + 'px';
            this.viewport.style.webkitTransformStyle = 'preserve-3d';
        },

        _createElement: function () {
            var viewport = doc.createElement('div');
            viewport.className = 'stage';
            return viewport;
        },

        getProjectionMatrix: function() {
            return Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
        },

        updateProjectionMatrix: function() {
            this.updateLookAt();
            return this.projectionMatrix.perspectiveLH(this.fov, this.aspect, this.near, this.far);
        },

        updateLookAt: (function() {

            var lm = new Matrix4(),
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

                return (previous = this.position.clone());
            };
        })(),

        lookAt: (function() {

            var m1 = new Matrix4();

            return function(target) {
                this.target = target || this.target || new Vector3();
                m1.lookAt(this.position, this.target, this.up);
                return this.viewMatrix.copy(m1);
            };
        })()
    });


    /*! -------------------------------------------------------------
        EXPORTS.
    ----------------------------------------------------------------- */
    exports.Camera   = Camera;
    exports.Renderer = Renderer;

}(window, window.document, window.Class, window));
