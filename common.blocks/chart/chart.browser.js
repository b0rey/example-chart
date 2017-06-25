modules.define('chart', [
    'i-bem-dom', 'd3', 'radio-group', 'select'
], function(
    provide, bemDom, d3, RadioGroup, Select
) {
    provide(bemDom.declBlock(this.name, {
        onSetMod: {
            'js': {
                'inited': function() {
                    let svg = d3.select("svg");
                    const margin = 50;
                    this._width = +svg.attr("width") - margin*2;
                    this._height = +svg.attr("height") - margin*2;

                    this._x = d3.scaleTime().range([0, this._width]);
                    this._y = d3.scaleLinear().range([this._height, 0]);
                    this._g = svg.append("g").attr(
                        'transform', `translate(${margin},${margin})`);
                    this._line = d3.line()
                        .x(d => this._x(d.date));

                    this._fetch(this._draw);

                    this._events(this.findChildBlock(RadioGroup))
                        .on('change', this._onChangePeriod);

                    this._events(this.findChildBlock(Select))
                        .on('change', this._onChangeParameter);
                }
            }
        },

        _onChangeParameter: function(e) {
            const parameter = e.target.getVal();
            this.setParameter(parameter);
        },

        setParameter: function(parameter = 'yield') {
            this._parameter = parameter;
            this._line.y(d => this._y(d[parameter]));
            this._redraw();
        },

        _fetch: function(fn) {
            d3.tsv('../../common.blocks/chart/data.tsv', d => ({
                date: d3.timeParse("%d-%b-%y")(d.date),
                yield: +d.yield,
                spread: +d.spread,
                price: +d.price,
            }), (error, data) => {
                if (error) throw error;

                this._source = data;
                this._maxDate = d3.max(data, d => d.date);
                this.setPeriod();
                this.setParameter();
                fn.call(this);
            });
        },

        _onChangePeriod: function(e) {
            const filter = e.target.getVal();
            this.setPeriod(filter);
            this._redraw();
        },

        setPeriod: function(filter) {
            if (!this.periodAgo[filter]) {
                this._data = this._source;
                return; 
            }

            let date = new Date(this._maxDate.getTime());
            this.periodAgo[filter](date);
            this._data = this._source.filter(d => d.date > date);
        },

        periodAgo: {
            week: (date) => date.setDate(date.getDate() - 7),
            month: (date) => date.setMonth(date.getMonth() - 1),
            quater: (date) => date.setMonth(date.getMonth() - 3),
            year: (date) => date.setFullYear(date.getFullYear() - 1),
        },

        _redraw: function() {
            this._g.selectAll('*').remove();
            this._draw();
        },

        _draw: function() {
            this._x.domain(d3.extent(this._data, d => d.date));
            this._y.domain([0, d3.max(
                this._data, d => d[this._parameter])]);

            this._g.append("g")
                .attr('transform', `translate(0,${this._height})`)
                .call(d3.axisBottom(this._x));
            this._g.append("g")
                .call(d3.axisLeft(this._y))

            this._g.append("path")
                .datum(this._data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", this._line);
        },
    }));
});
