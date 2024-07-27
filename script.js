// Define the parameters
let currentScene = 0;
const scenes = ["scene1", "scene2", "scene3"];
const width = 800, height = 600, margin = {top: 20, right: 30, bottom: 40, left: 50};

// Create an SVG container
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the CSV data
Promise.all([
    d3.csv("01-01-2021.csv"),
    d3.csv("01-01-2022.csv"),
    d3.csv("01-01-2023.csv")
]).then(function(files) {
    const data2021 = files[0];
    const data2022 = files[1];
    const data2023 = files[2];

    // Process the data
    const data = processData(data2021, data2022, data2023);

    // Initialize the visualization
    initializeScenes(data);
});

// Process the data
function processData(data2021, data2022, data2023) {
    // Convert data types
    data2021.forEach(d => d.cases = +d.cases);
    data2022.forEach(d => d.cases = +d.cases);
    data2023.forEach(d => d.cases = +d.cases);

    return {
        "2021": data2021,
        "2022": data2022,
        "2023": data2023
    };
}

// Initialize the scenes
function initializeScenes(data) {
    // Define scenes
    const scenes = [
        () => scene1(data["2021"]),
        () => scene2(data["2022"]),
        () => scene3(data["2023"])
    ];

    // Render the first scene
    scenes[0]();

    // Set up triggers
    d3.select("body").on("click", function() {
        currentScene = (currentScene + 1) % scenes.length;
        svg.selectAll("*").remove();
        scenes[currentScene]();
    });
}

// Define scales and axes
const xScale = d3.scaleBand().range([0, width]).padding(0.1);
const yScale = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Define scenes
function scene1(data) {
    xScale.domain(data.map(d => d.date));
    yScale.domain([0, d3.max(data, d => d.cases)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.cases))
        .attr("height", d => height - yScale(d.cases));

    svg.append("text")
        .attr("x", 50)
        .attr("y", 50)
        .text("COVID Data 2021")
        .attr("class", "annotation");
}

function scene2(data) {
    xScale.domain(data.map(d => d.date));
    yScale.domain([0, d3.max(data, d => d.cases)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.cases))
        .attr("height", d => height - yScale(d.cases));

    svg.append("text")
        .attr("x", 50)
        .attr("y", 50)
        .text("COVID Data 2022")
        .attr("class", "annotation");
}

function scene3(data) {
    xScale.domain(data.map(d => d.date));
    yScale.domain([0, d3.max(data, d => d.cases)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.cases))
        .attr("height", d => height - yScale(d.cases));

    svg.append("text")
        .attr("x", 50)
        .attr("y", 50)
        .text("COVID Data 2023")
        .attr("class", "annotation");
}
