class ScatterPlot {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
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

        const selectedYear = d3.select("#year").property("value");
        console.log(`Selected Year: ${selectedYear}`);  // Debugging line

        const filteredData = vis.data[selectedYear];
        console.log(`Filtered Data:`, filteredData);  // Debugging line

        if (!filteredData) {
            console.error(`No data found for year ${selectedYear}`);
            return;
        }

        vis.x.domain(filteredData.map(d => d.Province_State));
        vis.y.domain([0, d3.max(filteredData, d => d.Deaths)]);

        vis.svg.select(".x.axis")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.svg.select(".y.axis")
            .call(vis.yAxis);

        const circles = vis.svg.selectAll(".circle")
            .data(filteredData);

        circles.enter().append("circle")
            .attr("class", "circle")
            .attr("cx", d => vis.x(d.Province_State) + vis.x.bandwidth() / 2)
            .attr("cy", d => vis.y(d.Deaths))
            .attr("r", 5)
            .merge(circles)
            .attr("cx", d => vis.x(d.Province_State) + vis.x.bandwidth() / 2)
            .attr("cy", d => vis.y(d.Deaths))
            .attr("r", 5);

        circles.exit().remove();
    }
}
