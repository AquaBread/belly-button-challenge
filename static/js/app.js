// URL of the JSON file
let jsonUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Global variable to store the JSON data
let sampledata; 

// Selects dropdown menu
let dropdown = d3.select("#selDataset");

d3.json(jsonUrl).then(data => {
    // Stores the data in the global variable
    sampledata = data; 
    console.log(sampledata);

    // Gets the ids for the dropdown menu
    data.names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Calls the functions to display the data and the plots to the page
    optionChanged(data.names[0]);
});

// Function to update the plots based on the selected ID
function getPlots(id) {
    // Extracts data for the selected id
    let selectedSample = sampledata.samples.find(sample => sample.id === id);

    // Extracts and process the necessary data for plotting
    let sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    let otuID = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let labels = selectedSample.otu_labels.slice(0, 10);

    // Bar chart trace
    let trace = {
        x: sampleValues,
        y: otuID,
        text: labels,
        marker: {
            color: 'blue'
        },
        type: "bar",
        orientation: "h",
    };

    let data = [trace];

    // Layout variable for plots layout
    let layout = {
        title: "Top 10 OTU",
        yaxis: {
            tickmode: "linear",
        },
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 30
        }
    };

    // Bar Plot
    Plotly.newPlot("bar", data, layout);

    // Bubble chart trace
    let trace1 = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        mode: "markers",
        marker: {
            size: selectedSample.sample_values,
            color: selectedSample.otu_ids
        },
        text: selectedSample.otu_labels
    };

    // Layout for the bubble plot
    let layout_2 = {
        xaxis: { title: "OTU ID" },
        height: 600,
        width: 1000
    };

    let data1 = [trace1];

    // Bubble plot
    Plotly.newPlot("bubble", data1, layout_2);
}

// Function to display demographic information
function getDemoInfo(id) {
    // Gets the metadata info for the demographic panel
    let metadata = sampledata.metadata;
    console.log(metadata);

    // Filters metadata info by id
    let result = metadata.find(meta => meta.id.toString() === id);

    // Selects demographic panel to put data
    let demographicInfo = d3.select("#sample-metadata");

    // Empties the demographic info panel each time before getting new id info
    demographicInfo.html("");

    // Grabs the necessary demographic data for the id and append the info to the panel
    Object.entries(result).forEach((entry) => {
        let [key, value] = entry;
        demographicInfo.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });
}

// Function to handle dropdown selection changes
function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
}