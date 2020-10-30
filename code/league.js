function fetchFixtures(id){
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';

    //const from = new moment().format('yyyy-MM-DD');
    const from = moment().add(-5,'days').format('yyyy-MM-DD')
    const to = moment().add(10,'days').format('yyyy-MM-DD');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    var URL = `https://allsportsapi.com/api/football/?&met=Fixtures&from=${from}&to=${to}&leagueId=${id}&timezone=${tz}&APIkey=`+API_KEY;

    $.ajax({url: URL, success: function(response){
        fixtures = response.result;
        console.log(fixtures);
        if( fixtures !== undefined && fixtures.length >0 && fixtures !== null){
            makeFixtures(fixtures);
        }
        else{
            console.log(`no fixture of ${id}`);
        }
        //console.log("leagues Table",leagueTables);
    }});

}

function makeFixtures(fixtures){

    fixtures.sort(function(a, b) {
        return parseFloat(moment(a.event_date).format("x")) - parseFloat(moment(b.event_date).format("x"));
    });

    //console.log(fixtures);
    var eventDate = fixtures[0].event_date;
    var section = `<div class="league-fixtures"><h6 class="fixture-heading">${moment(eventDate).format('MMMM D')}</h6>`;


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

        if(eventDate !== fixtures[i].event_date){
            eventDate = fixtures[i].event_date;
            section = section.concat(`</div>`);
            $("#main-content").append(section);
            section = `<div class="league-fixtures"><h6 class="fixture-heading">${moment(eventDate).format('MMMM D')}</h6>`;
            
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

function fillLivescoreTable(id,name){

    $("#home-score-table > thead > tr> th> i").text(name);
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=Standings&leagueId=${id}&APIkey=`+API_KEY;
    
    $.ajax({url: URL, success: function(response){
        //console.log(response.result.total)
        var standings = response.result.total;
        console.log(standings);

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
                        <td class="text-center">${standings[i].standing_W}</td>
                        <td class="text-center">${standings[i].standing_D}</td>
                        <td class="text-center">${standings[i].standing_L}</td>
                        <td class="text-center">${standings[i].standing_F}</td>
                        <td class="text-center">${standings[i].standing_A}</td>
                        <td class="text-center">${standings[i].standing_GD}</td>
                        <td class="text-center">${standings[i].standing_PTS}</td>
                    </tr>
                `;
    
                $("#home-score-table > tbody").append(tableRow);
            }
        }
        


    }});
    
}

$(document).ready( function () {
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=Countries&APIkey=`+API_KEY;

    const urlParams = new URLSearchParams(window.location.search);
    const leagueId = urlParams.get('leagueId');
    const leagueName = urlParams.get('leagueName');


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

    }});

    //ajax call for displaying the fixtures for today for top 13 countries
    fetchFixtures(leagueId);

    fillLivescoreTable(leagueId, leagueName);
    
})