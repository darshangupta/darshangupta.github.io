// Define the parameters
let currentScene = 0;
const scenes = ["scene1", "scene2", "scene3"];
const width = 800, height = 600, margin = { top: 20, right: 30, bottom: 40, left: 50 };

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

    // Initialize the visualizations
    initializeScenes(data);
}).catch(function (error) {
    console.error("Error loading the data:", error);
});

// Process the data
function processData(data2021, data2022, data2023) {
    const parseDate = d3.timeParse("%Y-%m-%d");

    // Convert data types and parse dates
    data2021.forEach(d => {
        d.date = parseDate(d.date);
        d.cases = +d.cases;
    });
    data2022.forEach(d => {
        d.date = parseDate(d.date);
        d.cases = +d.cases;
    });
    data2023.forEach(d => {
        d.date = parseDate(d.date);
        d.cases = +d.cases;
    });

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
        () => new BarChart("#visualization1", "2021", data),
        () => new ScatterPlot("#visualization2", "2022", data),
        () => new BarChart("#visualization3", "2023", data)
    ];

    // Render the first scene
    scenes[0]();

    // Set up triggers
    d3.select("body").on("click", function () {
        currentScene = (currentScene + 1) % scenes.length;
        d3.select("#visualization").selectAll("*").remove();
        scenes[currentScene]();
    });
}
