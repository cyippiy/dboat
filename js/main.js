
let timeChart,formattedData,
    adultData,rawData,
    adultChart;

let time = 0;

d3.json("data/data.json").then(function (data) {
    // console.log(data);
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
    // console.log(formattedData);
    // Run the code every 0.1 second
    // d3.interval(function () {
    //     update();
    // }, 100);

    // timeChart = new TimeChart("#chart-area",formattedData);
});
let totalData;
d3.json("data/adults.json").then((data) => {
    totalData = data;
    let time;
    adultData = data.map((race) => { 
        race.teams.map(
            team => {
                    time = team.time.split(":");
                    team.time = +time[0] * 60 + parseFloat(time[1]);
                    return team;
            });
        return race;
    })
    // adultData = data.map((race) => { 
    //     race.teams.map(
    //         team => {
    //                 time = team.time.split(":");
    //                 team.time = +time[0] * 60 + parseFloat(time[1]);
    //                 return team;
    //         });
    //     return race;
    // })
    d3.interval(function () {
        update();
    }, 1500);

    adultChart = new TimeChart("#chart-area", adultData);
    // update();
});


function update(){
    // timeChart.wrangleData()
    adultChart.update();
}