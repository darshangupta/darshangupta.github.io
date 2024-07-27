class ScatterPlot {
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

        vis.x = d3.scaleTime()
            .range([0, vis.width]);

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

        vis.x.domain(d3.extent(vis.data, d => d.date));
        vis.y.domain([0, d3.max(vis.data, d => d.cases)]);

        vis.svg.select(".x.axis")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.svg.select(".y.axis")
            .call(vis.yAxis);

        const circles = vis.svg.selectAll(".circle")
            .data(vis.data);

        circles.enter().append("circle")
            .attr("class", "circle")
            .attr("cx", d => vis.x(d.date))
            .attr("cy", d => vis.y(d.cases))
            .attr("r", 5)
            .merge(circles)
            .attr("cx", d => vis.x(d.date))
            .attr("cy", d => vis.y(d.cases))
            .attr("r", 5);

        circles.exit().remove();
    }
}
