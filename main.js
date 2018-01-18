// alert("success!");
require.config({
    baseUrl: "node_modules",
    paths: {
        "d3": "d3/build/d3",
        "jquery": "jquery/dist/jquery"
    }
});
var dataset_1 = [];
var dataset_2 = [];
for (var i = 0; i < 40; i++) {
    var newNumber = Math.floor((Math.random()) * 300);
    dataset_1.push(newNumber);
}
for (var i = 0; i < 100; i++) {
    var x = Math.floor(Math.random() * 1100);
    var y = Math.floor(Math.random() * 600);
    var newCoordinate = [x, y];
    dataset_2.push(newCoordinate);
}
var w = 1200;
var h = 300;
var h_2 = 300;
var barPadding = 5;
var padding = 20;

require(['d3', 'jquery'], function (d3) {

    // 柱状图
    var svg_1 = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg_1.selectAll("rect")
        .data(dataset_1)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return i * (w / dataset_1.length);
        })
        .attr("y", function (d, i) {
            return h - d;
        })
        .attr("width", w / dataset_1.length - barPadding)
        .attr("height", function (d) {
            return d;
        })
        .attr("fill", function (d) {
            return "rgb(0," + d + ",0)";
        });

    svg_1.selectAll("text")
        .data(dataset_1)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return i * (w / dataset_1.length) + (w / dataset_1.length) / 2 - 2;
        })
        .attr("y", function (d, i) {
            return h - d + 13;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");


    var dataset_2_x_max = d3.max(dataset_2, function (d) {
        return d[0];
    });
    var dataset_2_y_max = d3.max(dataset_2, function (d) {
        return d[1];
    });
    // 比例尺
    var xScale = d3.scaleLinear()
        .domain([0, dataset_2_x_max])
        .range([padding, w - padding]);
    var yScale = d3.scaleLinear()
        .domain([0, dataset_2_y_max])
        .range([padding, h_2 - padding]);

    // 散点图
    var svg_2 = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h_2);

    svg_2.selectAll("circle")
        .data(dataset_2)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d[0]);
        })
        .attr("cy", function (d) {
            return yScale(d[1]);
        })
        .attr("r", function (d) {
            return Math.random() * 10 + 1;
        })
        .attr("fill", "teal");

    svg_2.selectAll("text")
        .data(dataset_2)
        .enter()
        .append("text")
        .text(function (d) {
            return "(" + d[0] + "," + d[1] + ")";
        })
        .attr("x", function (d) {
            return xScale(d[0]);
        })
        .attr("y", function (d) {
            return yScale(d[1]);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .attr("text-anchor", "start");

    var xAxis = d3.axisBottom(xScale);
    svg_2.append("g")
        .attr("transform","translate(0," + (h-padding)+")")
        .call(xAxis);
});