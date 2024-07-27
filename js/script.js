// Load the CSV data
Promise.all([
    d3.csv("data/01-01-2021.csv"),
    d3.csv("data/01-01-2022.csv"),
    d3.csv("data/01-01-2023.csv")
]).then(function (files) {
    const data2021 = files[0];
    const data2022 = files[1];
    const data2023 = files[2];

    // Process the data
    const data = processData(data2021, data2022, data2023);
    console.log(`Processed Data:`, data);  // Debugging line

    // Initialize the scatter plot visualization
    const scatterPlot = new ScatterPlot("#visualization", data);

    // Update the visualization when the year is changed
    d3.select("#year").on("change", function() {
        scatterPlot.updateVis();
    });
}).catch(function (error) {
    console.error("Error loading the data:", error);
});

// Process the data
function processData(data2021, data2022, data2023) {
    return {
        "2021": data2021.map(d => ({ Province_State: d.Province_State, Deaths: +d.Deaths })),
        "2022": data2022.map(d => ({ Province_State: d.Province_State, Deaths: +d.Deaths })),
        "2023": data2023.map(d => ({ Province_State: d.Province_State, Deaths: +d.Deaths }))
    };
}
