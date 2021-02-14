function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = sampleArray[0];
    console.log(result); // this is working

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    console.log(otu_ids, otu_labels, sample_values); // this is working

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var sorted_sample_values = sampleArray.sort((a,b) => b.sample_values - a.sample_values).reverse();
    console.log(sorted_sample_values); // this is working

    var sorted_sample_values = sample_values.slice(0, 10);
    var sorted_otu_ids = otu_ids.slice(0,10);
    var sorted_otu_labels = otu_labels.slice(0,10);
    console.log(sorted_sample_values, sorted_otu_ids, sorted_otu_labels); // this is working

    // y values = "OTU " + otu_id --> How do I add "OTU" as a prefix to the otu_id?
    var yticks = sorted_otu_ids.map(id => "OTU: " + id);
    //var yticks = sorted_sample_values.map(sorted_sample_values => sorted_sample_values.sample_values);
    console.log(yticks, sorted_sample_values); //this is working

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sorted_sample_values,
      y: yticks,
      type: "bar",
      orientation: 'h',
      text: sorted_otu_labels,// this creates the hovertext
      marker: {color: "darkmagenta"}
    };
    var barData = [trace];
   
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {autorange: 'reversed'} // this reverses the yaxis
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    //};

    // Use Plotly to plot the data with the layout. 

    // 1. Create the trace for the bubble chart.
    var trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: "bubble",
      mode: "markers",
      marker: {
        color: otu_ids, //['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        opacity: [1, 0.8, 0.6, 0.4],
        size: sample_values
      }
    };
    var bubbleData = [trace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID"},
      showlegend: false,
      hovermode: d3.select(optionChanged)
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    
    // D2: 3. Use Plotly to plot the data with the layout.
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      console.log(result);

      // Get the wfreq
      var wfreq_result = parseFloat(result.wfreq);
      console.log(wfreq_result);
  
    // 4. Create the trace for the gauge chart.
    var trace = {
      domain: d3.select(optionChanged),
      value: wfreq_result,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Wash Frequency</b><br> Number of Scrubs per Week"},
      gauge: {
        axis: { range: [0, 10], tickwidth:1, tickcolor: "black"},
        bar: { color: "black"},
        steps: [
          { range: [0, 2], color: "red"},
          { range: [2, 4], color: "orange"},
          { range: [4, 6], color: "yellow"},
          { range: [6, 8], color: "lightgreen"},
          { range: [8, 10], color: "darkgreen"}
        ],
        threshold: {
          line: { color: "lime", width: 6},
          thickness: 1.0,
          value: 10
        }
      }

    };
    
    var gaugeData = [trace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 400}; //margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  });
}
