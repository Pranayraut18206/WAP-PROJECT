const API_KEY = "5e569a29c7346987b41fba00f518e725";

// correct IDs
document.getElementById("filter").addEventListener("change", loadTeams);
document.getElementById("filter2").addEventListener("change", getMatches);

async function loadTeams() {
  const leagueId = document.getElementById("filter").value;
  const teamSelect = document.getElementById("filter2");

  if (!leagueId) return;

  teamSelect.innerHTML = "<option>Loading teams...</option>";

  try {
    const url = `https://v3.football.api-sports.io/teams?league=${leagueId}&season=2024`;

    const res = await fetch(url, {
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    const data = await res.json();

    teamSelect.innerHTML = `<option value="">Select Team</option>`;

    data.response.forEach(item => {
      const option = document.createElement("option");
      option.value = item.team.id;
      option.textContent = item.team.name;
      teamSelect.appendChild(option);
    });

  } catch (err) {
    console.error(err);
  }
}
function matchCreate(match){
  const container= document.getElementById("matches");
  let home = match.teams.home;
  let away = match.teams.away;

  const div = document.createElement("div");
  div.style.border = "1px solid #ddd";
  div.style.margin = "16px auto";
  div.style.padding = "10px";
  div.style.borderRadius = "10px";
  div.style.width="80%";

  div.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; gap:10px">
      <img src="${home.logo}" width="40">
      <b style="font-size: 25px">${home.name}</b>

      <span>vs</span>

      <b style="font-size: 25px">${away.name}</b>
      <img src="${away.logo}" width="40">
    </div>

    <p style="text-align:center; margin:8px;font-size:25px">
      ${match.goals.home} - ${match.goals.away}
    </p>

    <p style="text-align:center; font-size:16px;">
      ${new Date(match.fixture.date).toLocaleString()}
    </p>
  `;

    container.appendChild(div);
}

//  2. Get last matches of selected team
let allMatches = []; // store globally
async function getMatches() {
  const teamId = document.getElementById("filter2").value;
  const container = document.getElementById("matches");

  if (!teamId) return;

  container.innerHTML = "<p>Loading matches...</p>";

  try {
    const url = `https://v3.football.api-sports.io/fixtures?team=${teamId}&season=2024`;

    const res = await fetch(url, {
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    const data = await res.json();
    allMatches = data.response;

    container.innerHTML = "";

    if (!allMatches.length) {
      container.innerHTML = "<p>No matches found</p>";
      return;
    }

    renderMatches(allMatches);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading matches</p>";
  }
}
// render function
function renderMatches(matches) {
  const container = document.getElementById("matches");
  container.innerHTML = "";
  matches.forEach(match => matchCreate(match, container));
}

// filter logic
document.getElementById("filter3").addEventListener("change", () => {
  const result = document.getElementById("filter3").value;
  const teamId = document.getElementById("filter2").value;

  let filtered = allMatches.filter(match => {
    let homeScore, awayScore;

    if (match.teams.home.id == teamId) {
      homeScore = match.goals.home;
      awayScore = match.goals.away;
    } else {
      homeScore = match.goals.away;
      awayScore = match.goals.home;
    }

    if (result === "all") return true;

    if (homeScore === awayScore) return result === "draw";
    if (homeScore > awayScore) return result === "win";
    return result === "loss";
  });

  renderMatches(filtered);
});