modules.define('d3', ['loader_type_js'], function(provide, loader) {
    loader(
        'https://d3js.org/d3.v4.min.js',
        function() { provide(d3) }
    );
});
