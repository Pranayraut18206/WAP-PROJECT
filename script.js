document.getElementById("filter").addEventListener("change", getMatches);

async function getMatches() {
  const id = document.getElementById("filter").value;
  const container = document.getElementById("matches");
  const leagueMap = {
  "7293": "Premier League",
  "7351": "La Liga",
  "7286": "Serie A",
  "7339": "Bundesliga",
  "7335": "Ligue 1",
  "7318": "Champions League"
};
  const leagues = {
  "Premier League": [
    "Arsenal",
    "Aston Villa",
    "Bournemouth",
    "Brentford",
    "Brighton & Hove Albion",
    "Burnley",
    "Chelsea",
    "Crystal Palace",
    "Everton",
    "Fulham",
    "Leeds United",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Newcastle United",
    "Nottingham Forest",
    "Sunderland",
    "Tottenham Hotspur",
    "West Ham United",
    "Wolverhampton Wanderers"
  ],

  "La Liga": [
    "Real Madrid",
    "Barcelona",
    "Atletico Madrid",
    "Athletic Bilbao",
    "Real Sociedad",
    "Real Betis",
    "Villarreal",
    "Valencia",
    "Sevilla",
    "Getafe",
    "Celta Vigo",
    "Osasuna",
    "Mallorca",
    "Alaves",
    "Girona",
    "Rayo Vallecano",
    "Espanyol",
    "Levante",
    "Elche",
    "Real Oviedo"
  ],

  "Ligue 1": [
    "Paris Saint-Germain",
    "Marseille",
    "Lyon",
    "Monaco",
    "Lille",
    "Rennes",
    "Nice",
    "Lens",
    "Strasbourg",
    "Nantes",
    "Montpellier",
    "Toulouse",
    "Reims",
    "Brest",
    "Clermont Foot",
    "Lorient",
    "Metz",
    "Le Havre"
  ],

  "Bundesliga": [
    "Bayern Munich",
    "Borussia Dortmund",
    "RB Leipzig",
    "Bayer Leverkusen",
    "Union Berlin",
    "Eintracht Frankfurt",
    "Wolfsburg",
    "Borussia Monchengladbach",
    "Freiburg",
    "Mainz",
    "Augsburg",
    "Hoffenheim",
    "Stuttgart",
    "Werder Bremen",
    "Bochum",
    "Heidenheim",
    "Darmstadt",
    "Koln"
  ],
    "Serie A": [
    "Inter Milan",
    "AC Milan",
    "Juventus",
    "Napoli",
    "AS Roma",
    "Lazio",
    "Atalanta",
    "Fiorentina",
    "Bologna",
    "Torino",
    "Genoa",
    "Sampdoria",
    "Cagliari",
    "Udinese",
    "Sassuolo",
    "Empoli",
    "Lecce",
    "Parma",
    "Como",
    "Venezia"
  ],
  "Champions League": [
    "Manchester City",
    "Arsenal",
    "Liverpool",
    "Real Madrid",
    "Barcelona",
    "Atletico Madrid",
    "Bayern Munich",
    "Borussia Dortmund",
    "RB Leipzig",
    "Paris Saint-Germain",
    "Inter Milan",
    "AC Milan",
    "Napoli",
    "Benfica",
    "Porto",
    "PSV Eindhoven",
    "Celtic",
    "Ajax"
  ]
};
  if (!id) {
    alert("Select a league");
    return;
  }
  const team=document.getElementById("filter2")
  setTimeout(()=>{
  team.innerHTML=""
  const leagueName=leagueMap[id]
  const opt=document.createElement("option");
  opt.textContent="Select Teams"
  team.appendChild(opt);
  for (let val of leagues[leagueName]){
    const option=document.createElement("option");
      option.value = val;
      option.textContent = val;
      team.appendChild(option);
  }
  },500);

  container.innerHTML = "<p>Loading...</p>";

  try {
    const url="https://v3.football.api-sports.io/${}"
    fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": "5e569a29c7346987b41fba00f518e725",
      },
    });
    container.innerHTML = "";

    if (!data.events) {
      container.innerHTML = "<p>No matches available</p>";
      return;
    }

    for (let match of data.events.slice(0, 10)) {
      const homeRes = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=${match.idHomeTeam}`,
      );
      const awayRes = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=${match.idAwayTeam}`,
      );

      const homeData = await homeRes.json();
      const awayData = await awayRes.json();

      const homeBadge = homeData.teams?.[0]?.strTeamBadge;
      const awayBadge = awayData.teams?.[0]?.strTeamBadge;

      const div = document.createElement("div");
      div.classList.add("match");

      div.innerHTML = `
                <h3 style="display:flex; align-items:center; justify-content:center; gap:10px;">
                    
                    <img src="${homeBadge}" style="width:35px; height:35px;">
                    <span>${match.strHomeTeam}</span>

                    <span>vs</span>

                    <img src="${awayBadge}" style="width:35px; height:35px;">
                    <span>${match.strAwayTeam}</span>

                </h3>

                <p style="text-align:center;">📅 ${match.dateEvent}</p>
                <p style="text-align:center;">⏰ ${match.strTime}</p>
            `;

      container.appendChild(div);
    }
  } catch (err) {
    console.log(err);
    container.innerHTML = "<p>Error loading matches</p>";
  }
}
