class BarChart {
    constructor(_parentElement, _year, _data) {
        this.parentElement = _parentElement;
        this.year = _year;
        this.data = _data[_year];
        this.initVis();
    }

    // Initialize the visualization (static elements, scales, axes)
    initVis() {
        const vis = this;

        vis.margin = { top: 40, right: 20, bottom: 60, left: 60 };
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.1);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.x);
        vis.yAxis = d3.axisLeft(vis.y);

        vis.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${vis.height})`);

        vis.svg.append("g")
            .attr("class", "y axis");

        vis.updateVis();
    }

    // Update the visualization (scales, axes, data binding)
    updateVis() {
        const vis = this;

        vis.x.domain(vis.data.map(d => d.date));
        vis.y.domain([0, d3.max(vis.data, d => d.cases)]);

        vis.svg.select(".x.axis")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.svg.select(".y.axis")
            .call(vis.yAxis);

        const bars = vis.svg.selectAll(".bar")
            .data(vis.data);

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.x(d.date))
            .attr("width", vis.x.bandwidth())
            .attr("y", d => vis.y(d.cases))
            .attr("height", d => vis.height - vis.y(d.cases))
            .merge(bars)
            .attr("x", d => vis.x(d.date))
            .attr("width", vis.x.bandwidth())
            .attr("y", d => vis.y(d.cases))
            .attr("height", d => vis.height - vis.y(d.cases));

        bars.exit().remove();
    }
}
