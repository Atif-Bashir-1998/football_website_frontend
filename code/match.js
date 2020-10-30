function headToHead(firstId, secondId,firstName, secondName){
    //console.log(firstId, secondId);

    $("#content").html('');

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    var URL = `https://allsportsapi.com/api/football/?&met=H2H&firstTeamId=${firstId}&secondTeamId=${secondId}&timezone=${tz}&APIkey=`+API_KEY;

    //ajax call for displaying countries on the sidebar
    $.ajax({url: URL, success: function(response){
        console.log(response);
        var H2H = response.result.H2H;
        if (H2H !== undefined && H2H.length !== 0){
            $("#content").append(`<div class="league-fixtures"><h6 class="fixture-heading">Head To Head</h6>`);
            for (i=0; i<H2H.length; i++){
                var eventDate = H2H[i].event_date;
                var homeTeamName = H2H[i].event_home_team;
                var awayTeamName = H2H[i].event_away_team;
                var eventFinalScore = H2H[i].event_final_result;
                var leagueName = H2H[i].league_name;
                var leagueRound = H2H[i].league_round;

                var H2HCard = `<a href="./match.html?&matchId=${H2H[i].event_key}" class="head-to-head">
                    <p class="event-date">${eventDate}</p>
                    <div class="past-match">
                        <p>${homeTeamName}</p>
                        <p class="ml-3 mr-3">${eventFinalScore}</p>
                        <p>${awayTeamName}</p>
                    </div>
                    <p class="event-details">${leagueName}, ${leagueRound}</p>
                </a>`;

                $("#content").append(H2HCard);
            }
        }

        var firstTeamHistory = response.result.firstTeamResults;
        var secondTeamHistory = response.result.secondTeamResults;

        if (firstTeamHistory !== undefined && firstTeamHistory.length !== 0){
            $("#content").append(`<div class="league-fixtures"><h6 class="fixture-heading">${firstName}</h6>`);
            for (i=0; i<firstTeamHistory.length; i++){
                var eventDate = firstTeamHistory[i].event_date;
                var homeTeamName = firstTeamHistory[i].event_home_team;
                var awayTeamName = firstTeamHistory[i].event_away_team;
                var eventFinalScore = firstTeamHistory[i].event_final_result;
                var leagueName = firstTeamHistory[i].league_name;
                var leagueRound = firstTeamHistory[i].league_round;
                var eventKey = firstTeamHistory[i].event_key;
                

                var firstTeamHistoryCard = `<a href="./match.html?&matchId=${eventKey}" class="head-to-head">
                    <p class="event-date">${eventDate}</p>
                    <div class="past-match">
                        <p>${homeTeamName}</p>
                        <p class="ml-3 mr-3">${eventFinalScore}</p>
                        <p>${awayTeamName}</p>
                    </div>
                    <p class="event-details">${leagueName}, ${leagueRound}</p>
                </a>`;

                $("#content").append(firstTeamHistoryCard);
            }
        }

        if (secondTeamHistory !== undefined && secondTeamHistory.length !== 0){
            $("#content").append(`<div class="league-fixtures"><h6 class="fixture-heading">${secondName}</h6>`);
            for (i=0; i<secondTeamHistory.length; i++){
                var eventDate = secondTeamHistory[i].event_date;
                var homeTeamName = secondTeamHistory[i].event_home_team;
                var awayTeamName = secondTeamHistory[i].event_away_team;
                var eventFinalScore = secondTeamHistory[i].event_final_result;
                var leagueName = secondTeamHistory[i].league_name;
                var leagueRound = secondTeamHistory[i].league_round;
                var eventKey = secondTeamHistory[i].league_key;
                

                var firstTeamHistoryCard = `<a href="./match.html?&matchId=${eventKey}" class="head-to-head">
                    <p class="event-date">${eventDate}</p>
                    <div class="past-match">
                        <p>${homeTeamName}</p>
                        <p class="ml-3 mr-3">${eventFinalScore}</p>
                        <p>${awayTeamName}</p>
                    </div>
                    <p class="event-details">${leagueName}, ${leagueRound}</p>
                </a>`;

                $("#content").append(firstTeamHistoryCard);
            }
        }


    }});

}

function stats(matchStats){
    $("#content").html('');
    console.log(matchStats);
    if (matchStats.length === 0){
        var noStatsMessage = `
        <div class="alert alert-warning" role="alert">
            No stats available for the match!
        </div>
        `;

        $("#content").append(noStatsMessage);
    }
    else {
        for (i=0; i<matchStats.length; i++){
            var statsCard = `
                <div class="stats-card">
                    <p class="w-25">${matchStats[i].home}</p>
                    <p class="w-50">${matchStats[i].type}</p>
                    <p class="w-25">${matchStats[i].away}</p>
                </div>
            `;
            $("#content").append(statsCard);
        }
    }
}

function lineups(matchLineups, homeTeam, awayTeam){
    $("#content").html('');
    console.log(matchLineups);

    var homeTeamLineup = matchLineups.home_team.starting_lineups;
    var awayTeamLineup = matchLineups.away_team.starting_lineups;
    var homeTeamSubs = matchLineups.home_team.substitutes;
    var awayTeamSubs = matchLineups.away_team.substitutes;
    var homeTeamCoach = matchLineups.home_team.coaches;
    var awayTeamCoach = matchLineups.away_team.coaches;

    if (homeTeamLineup.length === 0){
        var noLineupMessage = `
        <div class="alert alert-warning" role="alert">
            No data for home team lineup!
        </div>
        `;

        $("#content").append(noLineupMessage);
    }

    else{
        $("#content").append(`<div class="lineups"><div class="home-lineups"><h6 class="text-center text-light">${homeTeam}</h6></div></div>`)
        for (i=0; i<homeTeamLineup.length; i++){
            var lineupCard = `
            <div class="stats-card">
                <p class="w-25">${homeTeamLineup[i].player_number}</p>
                <p class="w-75">${homeTeamLineup[i].player}</p>
            </div>
        `;
        $(".home-lineups").append(lineupCard);
        }
    }

    if (awayTeamLineup.length === 0){
        var noLineupMessage = `
        <div class="alert alert-warning" role="alert">
            No data for away team lineup!
        </div>
        `;

        $("#content").append(noLineupMessage);
    }

    else{
        $(".lineups").append(`<div class="away-lineups"><h6 class="text-center text-light">${awayTeam}</h6></div>`)
        for (i=0; i<awayTeamLineup.length; i++){
            var lineupCard = `
            <div class="stats-card">
                <p class="w-25">${awayTeamLineup[i].player_number}</p>
                <p class="w-75">${awayTeamLineup[i].player}</p>
            </div>
        `;
        $(".away-lineups").append(lineupCard);
        }
    }

    if (homeTeamSubs.length === 0){
        var noSubsMessage = `
        <div class="alert alert-warning" role="alert">
            No data for home team substitutes!
        </div>
        `;

        $("#content").append(noSubsMessage);
    }

    else{
        $("#content").append(`<div class="mt-4"><h6 class="text-center text-light">Substitutions</h6></div>`)
        $("#content").append(`<div class="subs"><div class="home-subs"></div></div>`);
        for (i=0; i<homeTeamSubs.length; i++){
            var subCard = `
            <div class="stats-card">
                <p class="w-25">${homeTeamSubs[i].player_number}</p>
                <p class="w-75">${homeTeamSubs[i].player}</p>
            </div>
        `;
        $(".home-subs").append(subCard);
        }
    }

    if (awayTeamSubs.length === 0){
        var noSubsMessage = `
        <div class="alert alert-warning" role="alert">
            No data for away team substitutes!
        </div>
        `;

        $("#content").append(noSubsMessage);
    }

    else {
        $(".subs").append(`<div class="away-subs"></div>`);
        for (i=0; i<homeTeamSubs.length; i++){
            var subCard = `
            <div class="stats-card">
                <p class="w-25">${homeTeamSubs[i].player_number}</p>
                <p class="w-75">${homeTeamSubs[i].player}</p>
            </div>
        `;
        $(".away-subs").append(subCard);
        }
    }

    if (homeTeamCoach.length === 0){
        var noCoachMessage = `
        <div class="alert alert-warning" role="alert">
            No data for home team coach!
        </div>
        `;

        $("#content").append(noCoachMessage);
    }

    else {
        $("#content").append(`<div class="mt-4"><h6 class="text-center text-light">Coaches</h6></div>`)
        $("#content").append(`<div class="coaches"><div class="home-coach"></div></div>`);
        for (i=0; i<homeTeamCoach.length; i++){
            var subCard = `
            <div class="stats-card">
                <p class="w-50">${homeTeamCoach[i].coache}</p>
            </div>
        `;
        $(".home-coach").append(subCard);
        }
    }

    if (awayTeamCoach.length === 0){
        var noCoachMessage = `
        <div class="alert alert-warning" role="alert">
            No data for away team coach!
        </div>
        `;

        $("#content").append(noCoachMessage);
    }

    else{
        $(".coaches").append(`<div class="away-coach"></div>`);
        for (i=0; i<homeTeamCoach.length; i++){
            var subCard = `
            <div class="stats-card">
                <p class="w-50">${awayTeamCoach[i].coache}</p>
            </div>
        `;
        $(".away-coach").append(subCard);
        }
    }



    //console.log(homeTeamLineup);
}

function table(leagueId, leagueName){
        //console.log(firstId, secondId);

        $("#content").html('');

        var standingsTable = `
        <table id="home-score-table" class="table-dark table-striped">
            <thead>
                <tr>
                    <th style="width: 30px;">#</th>
                    <th class="league-name">
                        <i id="table-name">League Name</i>
                    </th>
                    <th style="width:30px" class="text-center">P</th>
                    <th style="width:30px" class="text-center">W</th>
                    <th style="width:30px" class="text-center">D</th>
                    <th style="width:30px" class="text-center">L</th>
                    <th style="width:30px" class="text-center">F</th>
                    <th style="width:30px" class="text-center">A</th>
                    <th style="width:30px" class="text-center">Gd</th>
                    <th style="width:30px" class="text-center">PTS</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        `;

        $("#content").append(standingsTable);

        $("#table-name").text(leagueName);

        const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
        var URL = `https://allsportsapi.com/api/football/?&met=Standings&leagueId=${leagueId}&APIkey=`+API_KEY;
    
        //ajax call for displaying countries on the sidebar
        $.ajax({url: URL, success: function(response){
            console.log(response);

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

function info(goalscorers,cards,subs){
    $("#content").html('');
    //console.log(goalscorers);
    //console.log(cards);
    //console.log(subs);
    if (goalscorers.length === 0 && cards.length === 0 && subs.length ===0){
        var noMatchMessage = `
        <div class="alert alert-warning" role="alert">
            No match info yet!
        </div>
        `;

        $("#content").append(noMatchMessage);
    }else{
        var highlights = [];
        for (i=0; i<goalscorers.length; i++){
            highlights.push(goalscorers[i]);
        }
        for (i=0; i<cards.length; i++){
            highlights.push(cards[i]);
        }
        for (i=0; i<subs.length; i++){
            highlights.push(subs[i]);
        }
    
        highlights.sort(function(a, b) {
            return parseFloat(a.time) - parseFloat(b.time);
        });
    
        var yellowCard = `<img src="../assets/yellow_card.png" class="icon" />`;
        var redCard = `<img src="../assets/red-card.png" class="icon" />`;
        var goal = `<img src="../assets/ball.png" class="icon" />`;
        var playerIn = `<img src="../assets/match_green.png" class="icon" />`;
        var playerOut = `<img src="../assets/match_red.png" class="icon" />`;
    
        for(i=0; i<highlights.length; i++){
            //console.log(highlights[i])
    
            // Cards logic
            if(highlights[i].home_fault !== undefined && highlights[i].away_fault === "" ){
                if (highlights[i].card === "yellow card"){
                    var homeCard = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <p style="margin-right:150px">${highlights[i].home_fault} ${yellowCard}</p>
                        <p></p>
                    </div>
                `;
                }
                else {
                    var homeCard = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <p style="margin-right:150px">${highlights[i].home_fault} ${redCard}</p>
                        <p></p>
                    </div>
                `;
                }
    
                $("#content").append(homeCard);
            }
    
            if(highlights[i].away_fault !== undefined && highlights[i].home_fault === ""){
                if (highlights[i].card === "yellow card"){
                    var awayCard = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <p style="margin-left:150px">${yellowCard} ${highlights[i].away_fault}</p>
                        <p></p>
                    </div>
                `;
                }
                else{
                    var awayCard = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <p style="margin-left=150px">${redCard} ${highlights[i].away_fault}</p>
                        <p></p>
                    </div>
                `;
                }
                $("#content").append(awayCard);
            }
    
            // Goals Logic is here
            if(highlights[i].home_scorer !== undefined && highlights[i].away_scorer === "" && (highlights[i].score_info === "" || highlights[i].score_info === null || highlights[i].score_info==="Penalty") ){
                console.log("Home Goal");
                var homeGoal = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <p style="margin-right:150px">${highlights[i].home_scorer} ${goal}</p>
                        <p>${highlights[i].score}</p>
                    </div>
                `;
                $("#content").append(homeGoal);
            }
    
            if(highlights[i].away_scorer !== undefined && highlights[i].home_scorer === "" && (highlights[i].score_info === "" || highlights[i].score_info === null || highlights[i].score_info==="Penalty") ){
                console.log("Away Goal");
                var awayGoal = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <p style="margin-left:150px">${goal} ${highlights[i].away_scorer}</p>
                        <p>${highlights[i].score}</p>
                    </div>
                `;
                $("#content").append(awayGoal);
            }
    
            // Substitutions logic
            if( highlights[i].score =="substitution"){
                console.log(highlights[i]);
                if (highlights[i].away_scorer.length !== 0){
                    var awaySub = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <div style="margin-left:150px">
                            <p>${playerIn} ${highlights[i].away_scorer.in}</p>
                            <p>${playerOut} ${highlights[i].away_scorer.out}</p>
                        </div>
                        <p></p>
                    </div>
                `;
                $("#content").append(awaySub);
                }
    
                if (highlights[i].home_scorer.length !== 0){
                    var homeSub = `
                    <div class="highlight">
                        <p>${highlights[i].time}'</p>
                        <div style="margin-right:150px">
                            <p class="d-flex justify-content-between">${highlights[i].home_scorer.in} ${playerIn}</p>
                            <p class="d-flex justify-content-between">${highlights[i].home_scorer.out} ${playerOut}</p>
                        </div>
                        <p></p>
                    </div>
                `;
                $("#content").append(homeSub);
                }
    
            }
    
        }
    }

    console.log(highlights);
}

$(document).ready( function () {
    const API_KEY = 'c36f971edc2a89c5d62565bd51f32f29c49f3c14f8e1ab798b7f26951b24239f';
    

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('matchId');
    // const matchId = 445007;

    var URL = `https://allsportsapi.com/api/football/?&met=Fixtures&matchId=${matchId}&APIkey=`+API_KEY;


    //ajax call for displaying countries on the sidebar
    $.ajax({url: URL, success: function(response){
        const details = response.result[0];
        console.log( details );
        var homeTeam = details.event_home_team;
        var awayTeam = details.event_away_team;
        var eventFinalResult = details.event_final_result;
        var eventHalftimeResult = details.event_halftime_result;

        if (eventFinalResult === "-"){
            eventFinalResult = "? - ?";
            var matchCard = `
                <div class="match-result-row">
                    <p>${homeTeam}</p>
                    <p class="ml-4 mr-4">${eventFinalResult}</p>
                    <p>${awayTeam}</p>
                </div>
            `;
            $(".match-result").append(matchCard);
        }

        else{

            $(".match-status").text("FT");
            var matchCard = `
                <div class="match-result-row">
                    <p>${homeTeam}</p>
                    <p class="ml-4 mr-4">${eventFinalResult}</p>
                    <p>${awayTeam}</p>
                </div>
            `;
            $(".match-result").append(matchCard);
            //$(".match-result-row").append(matchCard);
            $(".half-time-result").html(`<p class="mr-4">half-time: </p><p class="ml-4">${eventHalftimeResult}</p>`);
        }

        // preparing data for head to head
        const homeTeamKey = details.home_team_key;
        const awayTeamKey = details.away_team_key;

        $("#head-to-head").on("click", function(){
            $(".active").removeClass("active");
            $(this).addClass("active");
            headToHead(homeTeamKey, awayTeamKey, homeTeam, awayTeam);
        })

        // preparing data for table
        const leagueKey = details.league_key;
        const leagueName = details.league_name;
        $("#table").on("click", function(){
            $(".active").removeClass("active");
            $(this).addClass("active");
            table(leagueKey,leagueName);
        })

        // preparing data for stats
        const matchStats = details.statistics;
        $("#stats").on("click", function(){
            $(".active").removeClass("active");
            $(this).addClass("active");
            stats(matchStats);
        })

        // preparing data for lineups
        const matchLineups = details.lineups;
        $("#lineups").on("click", function(){
            $(".active").removeClass("active");
            $(this).addClass("active");
            lineups(matchLineups, homeTeam, awayTeam);
        })

        // preparing for match info
        $("#info").on("click", function(){
            $(".active").removeClass("active");
            $(this).addClass("active");
            info(details.goalscorers, details.cards, details.substitutes);
        })


    }});
    
})