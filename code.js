function fetchFixtures(id,date){
    if (date !== undefined ){

        const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';

        //const from = new moment().format('yyyy-MM-DD');
        const to = moment().add(date,'days').format('yyyy-MM-DD');
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
        var URL = `https://allsportsapi.com/api/football/?&met=Fixtures&from=${to}&to=${to}&countryId=${id}&timezone=${tz}&APIkey=`+API_KEY;
    
        $.ajax({url: URL, success: function(response){
            fixtures = response.result;
            //console.log(fixtures);
            if( fixtures !== undefined && fixtures.length >0 && fixtures !== null){
                makeFixtures(fixtures);
            }
            else{
                //console.log(`no fixture of ${id}`);
            }
            //console.log("leagues Table",leagueTables);
        }});

    }else{
        const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';

        const from = new moment().format('yyyy-MM-DD');
        const to = moment().add(0,'days').format('yyyy-MM-DD');
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
        var URL = `https://allsportsapi.com/api/football/?&met=Fixtures&from=${from}&to=${to}&countryId=${id}&timezone=${tz}&APIkey=`+API_KEY;
    
        $.ajax({url: URL, success: function(response){
            fixtures = response.result;
            //console.log(fixtures);
            if( fixtures !== undefined && fixtures.length >0 && fixtures !== null){
                makeFixtures(fixtures);
            }
            else{
                //console.log(`no fixture of ${id}`);
            }
            //console.log("leagues Table",leagueTables);
        }});
    }

}

function makeFixtures(fixtures){

    fixtures.sort(function(a, b) {
        return parseFloat(a.league_key) - parseFloat(b.league_key);
    });

    console.log(fixtures);
    var countryName = fixtures[0].country_name;
    var countryKey = fixtures[0].event_country_key;
    var leagueName = fixtures[0].league_name;
    var eventDate = moment(fixtures[0].event_date).format('MMMM D');
    var leagueKey = fixtures[0].league_key;
    var section = `<div class="league-fixtures"><h6 class="fixture-heading"><span><a href="./views/country.html?&countryId=${countryKey}">${countryName}</a> - <a href="./views/league.html?&leagueName=${leagueName}&leagueId=${leagueKey}">${leagueName}</a></span><span>${eventDate}</span></h6>`;


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
            section = `<div class="league-fixtures"><h6 class="fixture-heading"><span><a href="./views/country.html?&countryId=${countryKey}">${countryName}</a> - <a href="./views/league.html?&leagueName=${leagueName}&leagueId=${leagueKey}">${fixtures[i].league_name}</a></span><span>${eventDate}</span></h6>`;

        }

        var fixtureCard = `
            <a class="match" href="./views/match.html?&matchId=${fixtures[i].event_key}">
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
        console.log(`${league.league_name}: `,standings);

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

$(document).ready( function () {

    // adding the top menu portion
    const negativeThree = moment().add(-3,'days').format('D');
    $("#-3").text(negativeThree);

    const negativeTwo = moment().add(-2,'days').format('D');
    $("#-2").text(negativeTwo);
    const negativeOne = moment().add(-1,'days').format('D');
    $("#-1").text(negativeOne);
    const positiveOne = moment().add(1,'days').format('D');
    $("#1").text(positiveOne);
    const positiveTwo = moment().add(2,'days').format('D');
    $("#2").text(positiveTwo);
    const positiveThree = moment().add(3,'days').format('D');
    $("#3").text(positiveThree);

    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=Countries&APIkey=`+API_KEY;

    var topCountries = [41,135,51,68,46,100,115,13,148,154,124,19,120];
    var topLeagues = [148,468,262,263,176,343,391,537,197,8669,8635,469,197,8736,407,178,343,391,51,512]
    var countryKeys = [];

    //ajax call for displaying countries on the sidebar
    $.ajax({url: URL, success: function(response){

        var home = `<a href="./index.html">Home</a>`;
        $("#sidebar").append(home);
        var live = `<a href="./views/livescore.html">Live</a>`;
        $("#sidebar").append(live);

        console.log( response );
        var countries = response.result;
        for (i = 0; i<countries.length; i++){
            var country = `<a href="./views/country.html?&countryId=${countries[i].country_key}" id="${countries[i].country_key}">${countries[i].country_name}</a>`;
            $("#sidebar").append(country);
            if (topCountries.includes(parseInt(countries[i].country_key))){
                //console.log("YES",countries[i].country_key);
            }
            else {
                //console.log("NO");
                fetchFixtures(countries[i].country_key)
            }
            
        }
        //console.log(countryKeys);

    }});

    //ajax call for displaying the fixtures for today for top 13 countries
    for (i=0; i<topCountries.length; i++){
        fetchFixtures(topCountries[i]);
    }

    
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

    // adding visual effects only
    $("#-3").on("click", function(){
        //removing active class from others
        $(".active").removeClass("active");

        $(this).addClass("active");
        $(".league-fixtures").remove();
        for (i=0; i<topCountries.length; i++){
            fetchFixtures(topCountries[i], -3);
        }
    })

    $("#-2").on("click", function(){
        $(".active").removeClass("active");

        $(this).addClass("active");
        $(".league-fixtures").remove();
        for (i=0; i<topCountries.length; i++){
            fetchFixtures(topCountries[i], -2);
        }
    })

    $("#-1").on("click", function(){
        $(".active").removeClass("active");

        $(this).addClass("active");
        $(".league-fixtures").remove();
        for (i=0; i<topCountries.length; i++){
            fetchFixtures(topCountries[i], -1);
        }
    })

    $("#today").on("click", function(){
        $(".active").removeClass("active");

        $(this).addClass("active");
        $(".league-fixtures").remove();
        for (i=0; i<topCountries.length; i++){
            fetchFixtures(topCountries[i], 0);
        }
    })

    $("#1").on("click", function(){
        $(".active").removeClass("active");

        $(this).addClass("active");
        $(".league-fixtures").remove();
        for (i=0; i<topCountries.length; i++){
            fetchFixtures(topCountries[i], 1);
        }
    })

    $("#2").on("click", function(){
        $(".active").removeClass("active");

        $(this).addClass("active");
        $(".league-fixtures").remove();
        for (i=0; i<topCountries.length; i++){
            fetchFixtures(topCountries[i], 2);
        }
    })

    $("#3").on("click", function(){
        $(".active").removeClass("active");
        
        $(this).addClass("active");
        $(".league-fixtures").remove();
        for (i=0; i<topCountries.length; i++){
            fetchFixtures(topCountries[i], 3);
        }
    })

    $("#live").on("click", function(){
        window.location.href = "./views/livescore.html";
    })

    $('#datepicker').datepicker({
        showOn: "button",
        buttonImage: "./assets/calendar.png",
        buttonImageOnly: true,
        buttonText: "Select date",
        onSelect: function(dateText) {
            $(".league-fixtures").remove();
            //console.log("Selected date: " + dateText + "; input's current value: " + this.value);
            var selectedDate = parseInt(moment(dateText).format("x"));
            //console.log(selectedDate);
            var today = moment().format("MM DD YYYY");
            today = parseInt(moment(today).format("x"));

            //console.log(today);
            var diff = Math.floor((selectedDate - today)/86400000);

            for (i=0; i<topCountries.length; i++){
                fetchFixtures(topCountries[i], diff);
            }

            $.ajax({url: URL, success: function(response){

                var home = `<a href="./index.html">Home</a>`;
                $("#sidebar").append(home);
                var live = `<a href="./views/livescore.html">Live</a>`;
                $("#sidebar").append(live);
        
                console.log( response );
                var countries = response.result;
                for (i = 0; i<countries.length; i++){
                    var country = `<a href="./views/country.html?&countryId=${countries[i].country_key}" id="${countries[i].country_key}">${countries[i].country_name}</a>`;
                    $("#sidebar").append(country);
                    if (topCountries.includes(parseInt(countries[i].country_key))){
                        //console.log("YES",countries[i].country_key);
                    }
                    else {
                        //console.log("NO");
                        fetchFixtures(countries[i].country_key,diff)
                    }
                    
                }
                //console.log(countryKeys);
        
            }});


        }
    })

    
})