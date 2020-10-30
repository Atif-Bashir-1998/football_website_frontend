function fetchFixtures(id, index){
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';

    //const from = new moment().format('yyyy-MM-DD');
    const today = new moment().format('yyyy-MM-DD');
    const from = moment().add(index,'days').format('yyyy-MM-DD');
    const to = moment().add(index,'days').format('yyyy-MM-DD');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    var URL = `https://allsportsapi.com/api/football/?&met=Fixtures&from=${from}&to=${to}&timezone=${tz}&countryId=${id}&APIkey=`+API_KEY;
    var counter = 0;

    $.ajax({
        url: URL,
        success: function(response){
        fixtures = response.result;
        
        console.log(fixtures);
        if( fixtures !== undefined && fixtures.length >0 && fixtures !== null){
            makeFixtures(fixtures);
            //return new Promise((resolve, reject) => {
            //    console.log("resolved")
            //    resolve(fixtures.length);
            //})
            //return fixtures.length;
            counter = fixtures.length;
        }
        else{
            //console.log(`no fixture of ${id}`);
            //return new Promise((resolve, reject) => {
            //    console.log("rejected")
           //     resolve(0);
           // })
            //return 0;
            counter = 0;
        }

        
    }})

}

function makeFixtures(fixtures){

    fixtures.sort(function(a, b) {
        return parseFloat(moment(a.event_date).format("x")) - parseFloat(moment(b.event_date).format("x"));
    });

    fixtures.sort(function(a, b) {
        return parseFloat(a.league_key) - parseFloat(b.league_key);
    });



    //console.log(fixtures);
    var countryName = fixtures[0].country_name;
    var leagueName = fixtures[0].league_name;
    var eventDate = fixtures[0].event_date;
    var leagueKey = fixtures[0].league_key;
    var section = `<div class="league-fixtures"><h6 class="fixture-heading"><span><a href="#">${countryName}</a> - <a href="./league.html?&leagueId=${leagueKey}&leagueName=${leagueName}">${leagueName}</a></span><span>${moment(eventDate).format('MMMM D')}</span></h6>`;


    //console.log('sorted: ', fixtures);

    for (i=0; i<fixtures.length; i++){
        var awayTeam = fixtures[i].event_away_team;
        var homeTeam = fixtures[i].event_home_team;
        var eventTime = fixtures[i].event_time;
        var eventFinalResult = fixtures[i].event_final_result;

        if (eventFinalResult === null || eventFinalResult.length === 0 || eventFinalResult === "-" ){
            eventFinalResult = "? - ?";
        }
        else{
            eventTime = "FT";
        }

        if(leagueKey !== fixtures[i].league_key){
            section = section.concat(`</div>`);
            leagueKey = fixtures[i].league_key;
            leagueName = fixtures[i].league_name;
            leagueKey = fixtures[i].league_key;
            $("#main-content").append(section);
            section = `<div class="league-fixtures"><h6 class="fixture-heading"><span><a href="#">${countryName}</a> - <a href="./league.html?&leagueId=${leagueKey}&leagueName=${leagueName}">${fixtures[i].league_name}"</a></span><span>${moment(eventDate).format('MMMM D')}</span></h6>`;
        }

        else if (eventDate !== fixtures[i].event_date){
            console.log(fixtures[i]);
            leagueKey = fixtures[i].league_key;
            leagueName = fixtures[i].league_name;
            section = section.concat(`</div>`);
            $("#main-content").append(section);
            section = `<div class="league-fixtures"><h6 class="fixture-heading"><span><a href="#">${countryName}</a> - <a href="./league.html?&leagueId=${leagueKey}&leagueName=${leagueName}">${fixtures[i].league_name}"</a></span><span>${moment(eventDate).format('MMMM D')}</span></h6>`;

            eventDate = fixtures[i].event_date;
        }

        var fixtureCard = `
            <a class="match" href="./match.html?&matchId=${fixtures[i].event_key}">
                <p class="w-25 ml-1">${eventTime}</p>
                <span class="scoring w-75">
                    <p class="w-25">${homeTeam}</p>
                    <p class="w-25">${eventFinalResult}</p>
                    <p class="w-25">${awayTeam}</p>
                </span>
            </a>
        `;

        section = section.concat(fixtureCard)
    }
    section = section.concat(`</div>`);
    //console.log(section);
    $("#main-content").append(section);

}

function fillTable(league){
    $("#country-score-table > thead > tr> th> i").text(league.league_name);
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=Standings&leagueId=${league.league_key}&APIkey=`+API_KEY;

    $.ajax({url: URL, success: function(response){
        console.log(response.result.total)
        var standings = response.result.total;
        console.log(`${league.league_name}: `,standings);

        if (standings.length === 0){
            $("#country-score-table > tbody").append(`
            <tr>
                <td></td>
                <td class="alert alert-warning" role="alert">
                    No data available
                </td>
            </tr>`);
        }

        else{
            for (i=0; i<standings.length; i++){
                var tableRow = `
                    <tr>
                        <td>${standings[i].standing_place}</td>
                        <td>${standings[i].standing_team}</td>
                        <td class="text-center">${standings[i].standing_P}</td>
                        <td class="text-center">${standings[i].standing_GD}</td>
                        <td class="text-center">${standings[i].standing_PTS}</td>
                    </tr>
                `;

                $("#country-score-table > tbody").append(tableRow);
            }
        }
        


    }});
}

function createLivescoreTable(){

    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';

    //const from = new moment().format('yyyy-MM-DD');
    const today = new moment().format('yyyy-MM-DD');
    const from = moment().add(0,'days').format('yyyy-MM-DD');
    const to = moment().add(7,'days').format('yyyy-MM-DD');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const urlParams = new URLSearchParams(window.location.search);
    const countryId = urlParams.get('countryId');

    var URL = `https://allsportsapi.com/api/football/?&met=Fixtures&from=${from}&to=${to}&timezone=${tz}&countryId=${countryId}&APIkey=`+API_KEY;
    
    $.ajax({url: URL, success: function(response){
        console.log(response.result)
        var leagues = response.result;
        var leagueKeys = [];
        for (i=0; i<leagues.length; i++){
            if (leagueKeys.includes(leagues[i].league_key)){
                console.log("repeated");
            }
            else {
                leagueKeys.push({
                    "league_name":leagues[i].league_name,
                    "league_key":leagues[i].league_key
                });
            }
            
        }

        console.log(leagueKeys);

        var index = 0;
        fillTable(leagueKeys[index]);
        // adding event listeners to the next and prev buttons on table
        $("#next-country-score-table").on("click",function(){
            index = (index+1)%leagueKeys.length;
            $("#country-score-table > tbody").html("");
            fillTable(leaguesKeys[index]);
        })
    
        $("#prev-country-score-table").on("click",function(){
            index = (index-1);
            if (index === -1){
                index = leagueKeys.length;
            }
            $("#country-score-table > tbody").html("");
            fillTable(leaguesKeys[index]);
        })

        //console.log(`${league.league_name}: `,standings);
        /*
        if (standings.length === 0){
            $("#home-score-table > tbody").append(`
            <tr>
                <td></td>
                <td class="alert alert-warning" role="alert">
                    No data available
                </td>
            </tr>`);
        }

        else{
            for (i=0; i<standings.length; i++){
                var tableRow = `
                    <tr>
                        <td>${standings[i].standing_place}</td>
                        <td>${standings[i].standing_team}</td>
                        <td class="text-center">${standings[i].standing_P}</td>
                        <td class="text-center">${standings[i].standing_GD}</td>
                        <td class="text-center">${standings[i].standing_PTS}</td>
                    </tr>
                `;
    
                $("#home-score-table > tbody").append(tableRow);
            }
        }
        */


    }});
    
}

function monthFixtures(countryId){
    for (i=-7; i<30; i++){
        fetchFixtures(countryId, i);
    }
    
}

$(document).ready( function () {

    const urlParams = new URLSearchParams(window.location.search);
    const countryId = urlParams.get('countryId');


    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=Countries&APIkey=`+API_KEY;

    //ajax call for displaying countries on the sidebar
    $.ajax({url: URL, success: function(response){
        var home = `<a href="../index.html">Home</a>`;
        $("#sidebar").append(home);
        var live = `<a href="./livescore.html">Live</a>`;
        $("#sidebar").append(live);

        console.log( response );
        var countries = response.result;
        for (i = 0; i<countries.length; i++){
            var country = `<a href="./country.html?&countryId=${countries[i].country_key}" id="${countries[i].country_key}">${countries[i].country_name}</a>`;
            $("#sidebar").append(country);
        }
        //console.log(countryKeys);

    }});

    //ajax call for displaying the fixtures of selected country
    monthFixtures(countryId);
    
    //createLivescoreTable();

    //const from = new moment().format('yyyy-MM-DD');
    const from = moment().add(0,'days').format('yyyy-MM-DD');
    const to = moment().add(7,'days').format('yyyy-MM-DD');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    var URL = `https://allsportsapi.com/api/football/?&met=Fixtures&from=${from}&to=${to}&timezone=${tz}&countryId=${countryId}&APIkey=`+API_KEY;
    
    var getCountryLeagues = $.ajax({url: URL,async:false, success: function(response){
        //console.log(response.result)
        var leagues = response.result;
        //console.log(leagues);
        //return leagues
    }
    })

    var countryLeagues = getCountryLeagues.responseJSON.result;
    var leagueKeys = [];
    var countryLeagueNames = [];
    if (countryLeagues !== undefined){
        for (i=0; i<countryLeagues.length; i++){
            //console.log(countryLeagues[i]);
            if (countryLeagueNames.includes(countryLeagues[i].league_name)){
                console.log("duplicate");
            }
            else{
                countryLeagueNames.push(countryLeagues[i].league_name);
                leagueKeys.push(
                    {
                        "league_name": countryLeagues[i].league_name,
                        "league_key": countryLeagues[i].league_key
                    }
                )
            }
    
        }

        // adding the event listeners
        var index = 0;
        fillTable(leagueKeys[index]);
        // adding event listeners to the next and prev buttons on table
        $("#next-country-score-table").on("click",function(){
            index = (index+1)%leagueKeys.length;
            $("#country-score-table > tbody").html("");
            fillTable(leagueKeys[index]);
        })
    
        $("#prev-country-score-table").on("click",function(){
            index = (index-1);
            
            if (index === -1){
                index = leagueKeys.length-1;
            }
            $("#country-score-table > tbody").html("");
            //console.log("asdf", leagueKeys[index])
            console.log(index)
            fillTable(leagueKeys[index]);
        })


    }

    else{
        $("#main-content").html('');
        var warningAlert = `
        <div class="alert alert-warning" role="alert">
            No Upcoming fixtures for 30 days!
        </div>
        `;
        $("#main-content").html(warningAlert);

    }



    

    
})