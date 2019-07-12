TimeChart = function(_parentElement, data){
    this.parentElement = _parentElement;
    this.data = data;
    this.initVis();
};

TimeChart.prototype.initVis = function() {
    let vis = this;

    vis.time = 0;

    vis.margin = { left: 80, right: 20, top: 50, bottom: 100 };
    vis.height = 500 - vis.margin.top - vis.margin.bottom;
    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    vis.g = vis.svg.append("g")
        .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

    vis.t = function() { return d3.transition().duration(100); }

    // Scales
    vis.x = d3.scaleLinear()
        .range([0,vis.width])
        .domain([0, 10]); 
    vis.y = d3.scaleLinear()
        .range([vis.height,0])
        .domain([110, 180]);
    vis.area = d3.scaleLinear()
        .range([0 * Math.PI, 50 * Math.PI])
        .domain([0, 4]);
    vis.colors = {
        "Dragon Warriors":"#FF0011",
        "Bay Area Dragons": "#3187F7",
        "Dieselfish": "#00C635",
        "Lightwave": "#71BEEB",
        "Dragon Max": "#FA8484",
        "Ripple Effect": "#FF9100",
        "Alameda Dragon Flyers": "#BC2020",
        "Northwind": "#003366",
        "East Harbor": "#FF007F",
        "Lowell": "#FF0000",
        "Lincoln": "#ECC501",
        "CYC": "#1C278D",
        "Washington": "#CA1F1F",
        "GCD": "#4C0998"

    };

    // Tooltip
    vis.tip = d3.tip().attr('class', 'd3-tip')
        .html(function (d) {
            let strTime= "";
            strTime += Math.floor(d.time/60);
            strTime += ":"
            let seconds = d3.format(".2f")(d.time % 60);
            if (Math.floor(seconds) < 10){
                strTime+="0";
            }
            strTime += seconds;
            var text = "<strong>Team:</strong> <span style='color:red'>" + d.team + "</span><br>";
            text += "<strong>Time:</strong> <span style='color:red'>" + strTime + "</span><br>";
            text += "<strong>Placement:</strong> <span style='color:red'>" + (d.place) + "</span><br>";
            text += "<strong>Crew Size</strong> <span style='color:red'>" + (d.size) + "</span><br>";
            return text;
        });
    vis.g.call(vis.tip);


    // Labels
    vis.xLabel = vis.g.append("text")
        .attr("y", vis.height + 50)
        .attr("x", vis.width / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Ranking (from top crew)");
    vis.yLabel = vis.g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -170)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Time (seconds)")
    vis.timeLabel = vis.g.append("text")
        .attr("y", vis.height - 10)
        .attr("x", vis.width - 60)
        .attr("font-size", "20px")
        .attr("opacity", "0.4")
        .attr("text-anchor", "middle")
        .text("RACE");


    // X Axis
    vis.xAxisCall = d3.axisBottom(vis.x)
        .tickFormat(function (d) { return +d; })
    vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${vis.height})`)
        .call(vis.xAxisCall);

    // Y Axis
    vis.yAxisCall = d3.axisLeft(vis.y)
        .tickFormat(function (d) { return +d; });
    vis.g.append("g")
        .attr("class", "y axis")
        .call(vis.yAxisCall);

    vis.update();
};

TimeChart.prototype.wrangleData = function(){
    let vis = this;
};

TimeChart.prototype.update = function () {
    let vis = this;
    vis.t = d3.transition()
        .duration(1000);

    // JOIN new data with old elements.
    let circles = vis.g.selectAll("circle").data(vis.data[vis.time].teams);
    // EXIT old elements not present in new data.
    circles.exit()
        .attr("class", "exit")
        .remove();

    // ENTER new elements present in new data.
    circles.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("fill", function (d) { return vis.colors[d.team]; })
        .on("mouseover", vis.tip.show)
        .on("mouseout", vis.tip.hide)
        .merge(circles)
        .transition(vis.t)
        .attr("cy", function (d) { return vis.y(d.time); })
        .attr("cx", function (d) { return vis.x(d.place); })
        .attr("r", function (d) { return Math.sqrt(vis.area(d.size)*20 / Math.PI) });

    // Update the time label
    vis.timeLabel.text(`${vis.data[vis.time].race}`);
    vis.time = (vis.time+1) % vis.data.length;
};