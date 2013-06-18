(function(win, doc) {

    'use strict';

    var viewport = doc.getElementById('viewport');
    var renderer = new Renderer({
        viewport: viewport
    });

    var camera = new Camera({
        perspective: 300,
        viewport: viewport,
        position: new Vector3(0, 0, 100)
    });

})(window, window.document);
