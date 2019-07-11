
let timeChart,formattedData;
let time = 0;

d3.json("data/data.json").then(function (data) {
    // console.log(data);

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
    console.log(formattedData);
    // Run the code every 0.1 second
    d3.interval(function () {
        update();
    }, 100);

    timeChart = new TimeChart("#chart-area",formattedData);
})

function update(){
    // timeChart.wrangleData()
    timeChart.update();
}