(function () {

    var assert = require("assert");

    describe('Model test', function() {

        var model = new Model();

        it('set(obj)形式でセット、get("string")で各値が取り出せる', function() {
            var obj = {
                test: 'test'
            };

            model.set({
                foo: 'bar',
                baz: obj
            });

            assert.equal('bar', model.get('foo'));
            assert.equal(obj, model.get('baz'));
        });

        it('set("string", obj)形式でセット、get("string")で値が取り出せる', function() {
            model.set('hoge', 'fuga');
            assert.equal('fuga', model.get('hoge'));
        });

        it('previousで前回の値が参照できる', function (done) {
            model.set('hoge', 'hoge1');

            model.on('change', function (evt) {
                assert.equal('hoge1', this.previous('hoge'));
                done();
            });

            model.set('hoge', 'hoge2');
        });
    });

    describe('Component test', function () {
        var parent = null;
        var child1 = null;
        var child2 = null;
        var child3 = null;

        beforeEach(function (done) {
            parent = new Component();
            child1 = new Component();
            child2 = new Component();
            child3 = new Component();
            done();
        });
        it('addChildで追加することができる', function () {
            parent.addChild(child1);
            assert.equal(child1, parent.children[0]);
        });

        it('addChildで元の親から削除される', function () {
            var parent2 = new Component();
            parent.addChild(child1);
            assert.equal(child1, parent.children[0]);
            parent2.addChild(child1);
            assert.equal(child1, parent2.children[0]);
            assert.equal(parent.children.length, 0);
        });

        it('removeChildで削除できる', function () {
            parent.addChild(child1);
            parent.addChild(child2);
            parent.addChild(child3);

            parent.removeChild(child2);
            assert.equal(child1, parent.children[0]);
            assert.equal(child3, parent.children[1]);
        });

        it('Eventがバブリングする', function (done) {
            parent.addChild(child1);

            parent.on('child2-event', function (evt) {
                assert.ok(true);
                done();
            });

            child1.addChild(child2);

            child1.on('child2-event', function (evt) {
                console.log('done');
            });

            child2.trigger('child2-event', {
                data: 'data'
            });
        });

        it('stopPropagationでバブリングをキャンセルできる', function () {

            var not_called = true;

            parent.addChild(child1);
            parent.on('child2-event', function (evt) {
                not_called = false;
            });

            child1.addChild(child2);

            child1.on('child2-event', function (evt) {
                evt.stopPropagation();
            });

            child2.trigger('child2-event', {
                data: 'data'
            });

            assert.equal(true, not_called);
        });

        it('targetで発生元、currentTargetで監視要素を参照できる', function () {
            parent.addChild(child1);
            child1.addChild(child2);
            child2.addChild(child3);

            parent.on('reftest', function (evt) {
                assert.equal(parent, evt.currentTarget);
                assert.equal(child3, evt.target);
            });

            child2.on('reftest', function (evt) {
                assert.equal(child2, evt.currentTarget);
                assert.equal(child3, evt.target);
            });

            child3.trigger('reftest');
        });
    });

    describe('EventDispatcher test', function () {

        var evt = null;

        beforeEach(function () {
            evt = new EventDispatcher();
        });

        it('onでイベントハンドラが登録でき、triggerでイベントが発火しデータを送信できる', function (done) {
            evt.on('hoge', function (evt) {
                assert.equal('hoge', evt.type);
                assert.equal('data', evt.data);
                done();
            });

            evt.trigger('hoge', {
                data: 'data'
            });
        });

        it('off(type, func)で該当ハンドラを削除できる', function () {

            var not_called = true;

            function calledTest() {
                not_called = false;
            }
            evt.on('calledcheck', calledTest);
            evt.off('calledcheck', calledTest);
            evt.trigger('calledcheck');

            assert.equal(true, not_called);
        });

        it('off(type)で該当イベントのハンドラをすべて削除できる', function () {

            var not_called = true;

            function calledTest1() {
                not_called = false;
            }
            function calledTest2() {
                not_called = false;
            }
            function calledTest3() {
                not_called = false;
            }
            evt.on('calledcheck', calledTest1);
            evt.on('calledcheck', calledTest2);
            evt.on('calledcheck', calledTest3);
            evt.off('calledcheck');
            evt.trigger('calledcheck');

            assert.equal(true, not_called);
        });

        it('off()で全イベントハンドラを削除できる', function () {

            var not_called = true;

            function calledTest1() {
                not_called = false;
            }
            function calledTest2() {
                not_called = false;
            }
            function calledTest3() {
                not_called = false;
            }
            evt.on('calledcheck1', calledTest1);
            evt.on('calledcheck2', calledTest2);
            evt.on('calledcheck3', calledTest3);
            evt.off();
            evt.trigger('calledcheck1');
            evt.trigger('calledcheck2');
            evt.trigger('calledcheck3');

            assert.equal(true, not_called);
        });

        it('oneで一度だけのハンドラを登録できる', function () {
            var count = 0;

            function countcheck() {
                count++;
            }

            evt.one('countcheck', countcheck);
            evt.trigger('countcheck');
            evt.trigger('countcheck');
            evt.trigger('countcheck');

            assert.equal(1, count);
        });
    });
}());
