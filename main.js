require.config({
    baseUrl: "node_modules",
    paths: {
        d3: "d3/build/d3",
        "d3-collection": "d3-collection/build/d3-collection",
        "d3-dispatch": "d3-dispatch/build/d3-dispatch",
        "d3-quadtree": "d3-quadtree/build/d3-quadtree",
        "d3-timer": "d3-timer/build/d3-timer",
        "d3-force": "d3-force/build/d3-force",
        "jquery": "jquery/dist/jquery"
    }
});
var dataset_1 = [];
var dataset_2 = [];
var dataset_3 = {
    nodes: [{ name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6" },
    { name: "7" },
    { name: "8" },
    { name: "9" },
    { name: "10" }
    ],
    links: [{
        source: "1",
        target: "2"
    }, {
        source: "1",
        target: "3"
    }, {
        source: "10",
        target: "4"
    }, {
        source: "1",
        target: "5"
    }, {
        source: "2",
        target: "6"
    }, {
        source: "3",
        target: "6"
    }, {
        source: "2",
        target: "5"
    }, {
        source: "3",
        target: "4"
    }, {
        source: "5",
        target: "8"
    }, {
        source: "5",
        target: "9"
    }, {
        source: "6",
        target: "7"
    }, {
        source: "7",
        target: "8"
    }, {
        source: "8",
        target: "9"
    }]
};
for (var i = 0; i < 40; i++) {
    var newNumber = Math.floor(Math.random() * 300);
    dataset_1.push(newNumber);
}
for (var i = 0; i < 100; i++) {
    var x = Math.floor(Math.random() * 1100);
    var y = Math.floor(Math.random() * 600);
    var newCoordinate = [x, y];
    dataset_2.push(newCoordinate);
}
var w = 1200;
var h = 600;
var h_2 = 300;
var barPadding = 5;
var padding = 20;

require(["d3"], function (d3) {
    function drawSimple() {
        // 柱状图
        var svg_1 = d3.select("body").append("svg").attr("width", w).attr("height", h_2);

        svg_1.selectAll("rect")
            .data(dataset_1)
            .enter()
            .append("rect")
            .attr("x", function (d, i) { return i * (w / dataset_1.length); })
            .attr("y", function (d, i) { return h_2 - d; })
            .attr("width", w / dataset_1.length - barPadding)
            .attr("height", function (d) { return d; })
            .attr("fill", function (d) { return "rgb(0," + d + ",0)"; });

        svg_1.selectAll("text")
            .data(dataset_1)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", function (d, i) { return i * (w / dataset_1.length) + w / dataset_1.length / 2 - 2; })
            .attr("y", function (d, i) { return h_2 - d + 13; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "13px")
            .attr("fill", "white")
            .attr("text-anchor", "middle");

        var dataset_2_x_max = d3.max(dataset_2, function (d) { return d[0]; });
        var dataset_2_y_max = d3.max(dataset_2, function (d) { return d[1]; });
        // 比例尺
        var xScale = d3.scaleLinear().domain([0, dataset_2_x_max]).range([padding, w - padding]);
        var yScale = d3.scaleLinear().domain([0, dataset_2_y_max]).range([padding, h_2 - padding]);

        // 散点图
        var svg_2 = d3.select("body").append("svg").attr("width", w).attr("height", h_2);
        svg_2.selectAll("circle")
            .data(dataset_2)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d[0]); })
            .attr("cy", function (d) { return yScale(d[1]); })
            .attr("r", function (d) { return Math.random() * 10 + 1; })
            .attr("fill", "teal");

        svg_2.selectAll("text")
            .data(dataset_2)
            .enter()
            .append("text")
            .text(function (d) { return "(" + d[0] + "," + d[1] + ")"; })
            .attr("x", function (d) { return xScale(d[0]); })
            .attr("y", function (d) { return yScale(d[1]); })
            .attr("font-family", "sans-serif")
            .attr("font-size", "13px")
            .attr("text-anchor", "start");

        var xAxis = d3.axisBottom(xScale);
        svg_2.append("g").attr("transform", "translate(0," + (h / 2 - padding) + ")").call(xAxis);
    }
    drawSimple();

    // 力导向布局
    // var color = d3.schemeCategory20;
    var svg_3 = d3.select("body").append("svg").attr("width", w).attr("height", h).attr("class", "force");

    var simulation = d3.forceSimulation(dataset_3.nodes)
        .velocityDecay(0.5)
        .force("link", d3.forceLink(dataset_3.links).id(function (d) { return d.name; }).distance(100))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(w / 2, h / 2))
        .force("collide", d3.forceCollide(50));

    simulation.alpha(1.5).alphaMin(0.001).alphaDecay(0.0228).alphaTarget(0);

    // 画线
    var lines = svg_3.selectAll("line")
        .data(dataset_3.links)
        .enter()
        .append("line")
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; })
        .style("stroke", "black");

    // 画点
    var circles = svg_3.selectAll("circle")
        .data(dataset_3.nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .style("fill", "teal")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

    function draw() {
        circles.attr("cx", function (d) { return d.x; }).attr("cy", function (d) { return d.y; });
        lines.attr("x1", function (d) { return d.source.x; }).attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; }).attr("y2", function (d) { return d.target.y; });
    }

    simulation.on("tick", draw);

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.06).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) { simulation.alphaTarget(0.06); }
        d.fx = null;
        d.fy = null;
    }
});