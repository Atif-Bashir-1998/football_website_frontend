function fetchLivescore(countryId){
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';

    const from = new moment().format('yyyy-MM-DD');
    const to = moment().add(0,'days').format('yyyy-MM-DD');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    var URL = `https://allsportsapi.com/api/football/?&met=Livescore&countryId=${countryId}&timezone=${tz}&APIkey=`+API_KEY;

    $.ajax({url: URL, success: function(response){
        fixtures = response.result;
        //console.log(`country id: ${countryId}`,fixtures);
        if( fixtures !== undefined && fixtures.length >0 && fixtures !== null){
            makeLivescore(fixtures);
        }
        else{
            //console.log(`no fixture of ${id}`);
        }
        //console.log("leagues Table",leagueTables);
    }});

}

function makeLivescore(fixtures){

    fixtures.sort(function(a, b) {
        return parseFloat(a.league_key) - parseFloat(b.league_key);
    });

    console.log(fixtures);
    var countryName = fixtures[0].country_name;
    var countryKey = fixtures[0].event_country_key;
    var leagueName = fixtures[0].league_name;
    var eventDate = moment(fixtures[0].event_date).format('MMMM D');
    var leagueKey = fixtures[0].league_key;
    var section = `<div class="league-fixtures"><h6 class="fixture-heading"><span><a href="./country.html?&countryId=${countryKey}">${countryName}</a> - <a href="./league.html?&leagueName=${leagueName}&leagueId=${leagueKey}">${leagueName}</a></span><span>${eventDate}</span></h6>`;


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
            countryKey = fixtures[i].event_country_key;
            $("#main-content").append(section);
            section = `<div class="league-fixtures"><h6 class="fixture-heading"><span><a href="./country.html?&countryId=${countryKey}">${countryName}</a> - <a href="./league.html?&leagueName=${leagueName}&leagueId=${leagueKey}">${fixtures[i].league_name}</a></span><span>${eventDate}</span></h6>`;

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

        $(`#${fixtures[i].event_key}`).bind("click", matchEventListner);

        section = section.concat(fixtureCard)
    }
    section = section.concat(`</div>`);
    //console.log(section);
    $("#main-content").append(section);

}

function fillLivescoreTable(index){
    
    //displaying score table for top 8 leagues
    var leagueTables = [
            {
                "league_name": "Premier League",
                "league_key": 148
            },
            {
                "league_name": "Bundesliga",
                "league_key": 195
            },
            {
                "league_name": "LaLiga Santander",
                "league_key": 468
            },
            {
                "league_name": "Ligue 1",
                "league_key": 176
            },
            {
                "league_name": "Serie A",
                "league_key": 262
            },
            {
                "league_name": "Eredivisie",
                "league_key": 343
            },
            {
                "league_name": "Primeria Liga",
                "league_key": 391
            }
            
        ];

    var league = leagueTables[index];
    $("#home-score-table > thead > tr> th> i").text(league.league_name);
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=Standings&leagueId=${league.league_key}&APIkey=`+API_KEY;
    
    $.ajax({url: URL, success: function(response){
        //console.log(response.result.total)
        var standings = response.result.total;
        //console.log(`${league.league_name}: `,standings);

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
        


    }});
    
}

function matchEventListner(){
    console.log("Event");
    $(".match").on("click",function(){
        console.log("hi");
        var matchId = $(this).getAttr("id");
        console.log(matchId);
    })
}

$(document).ready( function () {
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=Countries&APIkey=`+API_KEY;

    var topCountries = [41,135,51,68,46,100,115,13,148,154,124,19,120];
    for (i=0; i<topCountries.length; i++){
        fetchLivescore(topCountries[i])
    }

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
            if (topCountries.includes(parseInt(countries[i].country_key))){
                //console.log("YES",countries[i].country_key);
            }
            else {
                //console.log("NO",countries[i].country_key);
                fetchLivescore(countries[i].country_key);
            }
            
        }
        console.log("fetching done");
        //matchEventListner();
    }});

    // adding event listeners to the mini score table
    var index = 0;
    fillLivescoreTable(index);
    // adding event listeners to the next and prev buttons on table
    $("#next-home-score-table").on("click",function(){
        index = (index+1)%7;
        $("#home-score-table > tbody").html("");
        fillLivescoreTable(index);
    })

    $("#prev-home-score-table").on("click",function(){
        index = (index-1);
        if (index === -1){
            index = 6;
        }
        $("#home-score-table > tbody").html("");
        fillLivescoreTable(index);
    })

    
})