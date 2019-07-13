
let timeChart,formattedData,
    adultData,rawData,
    adultChart, youthData,
    youthChart;

let time = 0;
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


function update(){
    adultChart.update();
    youthChart.update();
}