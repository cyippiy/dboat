
let timeChart,formattedData,
    adultData,rawData,
    adultChart, youthData,
    youthChart;

let time = 0;

d3.json("data/data.json").then(function (data) {
    rawData = data;
    // Clean data
    formattedData = data.map(function (year) {
        return year["countries"].filter(function (country) {
            var dataExists = (country.income && country.life_exp);
            return dataExists
        }).map(function (country) {
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;
        })
    });
});
let totalData;
d3.json("data/adults.json").then((data) => {
    totalData = data;
    adultData = data.map((race) => { 
        race.teams.map(
            team => {
                    time = team.time.split(":");
                    team.time = +time[0] * 60 + parseFloat(time[1]);
                    return team;
            });
        return race;
    })
    adultChart = new TimeChart("#chart-area-adult", adultData);
});

d3.json("data/youth.json").then( (data) => {
    totalData = data;
    youthData = data.map((race) => {
        race.teams.map(
            team => {
                time = team.time.split(":");
                team.time = +time[0] * 60 + parseFloat(time[1]);
                return team;
            });
        return race;
    });

    youthChart = new TimeChart("#chart-area-youth", youthData);
    d3.interval(function () {
        update();
    }, 1500);

});

var filteredData;
var lineChart1,
    lineChart2,
    lineChart3,
    lineChart4,
    lineChart5;
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");

// Event listeners
$("#coin-select").on("change", updateCharts);
$("#var-select").on("change", updateCharts);

// Add jQuery UI slider
$("#date-slider").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),
    min: parseTime("12/5/2013").getTime(),
    step: 86400000, // One day
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function (event, ui) {
        $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
        $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
        updateCharts();
    }

});

d3.json("data/coins.json").then(function (data) {

    // Prepare and clean data
    filteredData = {};
    for (var coin in data) {
        if (!data.hasOwnProperty(coin)) {
            continue;
        }
        filteredData[coin] = data[coin].filter(function (d) {
            return !(d["price_usd"] == null)
        })
        filteredData[coin].forEach(function (d) {
            d["price_usd"] = +d["price_usd"];
            d["24h_vol"] = +d["24h_vol"];
            d["market_cap"] = +d["market_cap"];
            d["date"] = parseTime(d["date"])
        });
    }

    lineChart1 = new GenderChart("#chart-area1", "bitcoin");
    lineChart2 = new GenderChart("#chart-area2", "ethereum");
    lineChart3 = new GenderChart("#chart-area3", "bitcoin_cash");
    lineChart4 = new GenderChart("#chart-area4", "litecoin");
    lineChart5 = new GenderChart("#chart-area5", "ripple");

});

function update(){
    // timeChart.wrangleData()
    adultChart.update();
    youthChart.update();

}

function updateCharts() {
    lineChart1.wrangleData()
    lineChart2.wrangleData()
    lineChart3.wrangleData()
    lineChart4.wrangleData()
    lineChart5.wrangleData()
}