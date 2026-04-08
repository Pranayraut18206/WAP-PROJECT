export default function Matches() {
document.getElementById("content").innerHTML="";

  const existing = document.getElementById("matches-root");
  if (existing){
    existing.remove()
};

  const div = document.createElement("div");
  div.id = "matches-root";
  div.innerHTML = `
    <div class="controls">
      <select id="league-select">
        <option value="" disabled selected>Select League</option>
        <option value="4328">Premier League</option>
        <option value="4335">La Liga</option>
        <option value="4332">Serie A</option>
        <option value="4331">Bundesliga</option>
        <option value="4334">Ligue 1</option>
        <option value="4480">Champions League</option>
      </select>
      <select id="season-select" disabled>
        <option value="" disabled selected>Select Season</option>
        <option value="2024-2025">2024-2025</option>
        <option value="2023-2024">2023-2024</option>
        <option value="2022-2023">2022-2023</option>
        <option value="2021-2022">2021-2022</option>
        <option value="2020-2021">2020-2021</option>
        <option value="2019-2020">2019-2020</option>
        <option value="2018-2019">2018-2019</option>
        <option value="2017-2018">2017-2018</option>
        <option value="2016-2017">2016-2017</option>
        <option value="2015-2016">2015-2016</option>
      </select>
      <select id="result-filter" disabled>
        <option value="all">All Results</option>
        <option value="home">Home Win</option>
        <option value="away">Away Win</option>
        <option value="draw">Draw</option>
      </select>
    </div>
    <div id="matches-list">
      <p class="hint">Select a league and season to see matches.</p>
    </div>
  `;

  document.getElementById("content").appendChild(div);

  const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123";
  let allEvents = [];

  const leagueSelect  = document.getElementById("league-select");
  const seasonSelect  = document.getElementById("season-select");
  const resultFilter  = document.getElementById("result-filter");

  leagueSelect.addEventListener("change", () => {
    seasonSelect.disabled = false;
    resultFilter.disabled = true;
    allEvents = [];
    document.getElementById("matches-list").innerHTML =
      "<p class='hint'>Now select a season.</p>";
  });

  seasonSelect.addEventListener("change", () => {
    resultFilter.disabled = false;
    if (leagueSelect.value) loadLeague();
  });

  resultFilter.addEventListener("change", applyFilter);

  function loadLeague() {
    const leagueId = leagueSelect.value;
    const season   = seasonSelect.value;
    allEvents = [];
    showStatus("Loading matches...");

    fetch(`${BASE_URL}/eventsseason.php?id=${leagueId}&s=${season}`)
      .then(res => res.json())
      .then(data => {
        allEvents = data.events || [];
        if (allEvents.length === 0) {
          showStatus(`No matches found for the ${season} season.`);
          return;
        }
        allEvents.sort((a, b) => new Date(b.dateEvent) - new Date(a.dateEvent));
        applyFilter();
      })
      .catch(() => showStatus("Failed to load. Check your internet connection."));
  }

  function applyFilter() {
    const filter = resultFilter.value;
    const filtered = allEvents.filter(ev => {
      const hs  = Number(ev.intHomeScore);
      const asc = Number(ev.intAwayScore);
      if (filter === "all")  return true;
      if (isNaN(hs))         return false;
      if (filter === "home") return hs > asc;
      if (filter === "away") return asc > hs;
      if (filter === "draw") return hs === asc;
      return true;
    });
    renderMatches(filtered);
  }

  function renderMatches(events) {
    const container = document.getElementById("matches-list");
    if (events.length === 0) {
      container.innerHTML = "<p class='hint'>No matches for this filter.</p>";
      return;
    }
    container.innerHTML = events.map(buildCard).join("");
  }

  function buildCard(ev) {
    const home    = ev.strHomeTeam  || "Home";
    const away    = ev.strAwayTeam  || "Away";
    const hs      = ev.intHomeScore !== null ? ev.intHomeScore : "-";
    const asc     = ev.intAwayScore !== null ? ev.intAwayScore : "-";
    const dateStr = ev.dateEvent
      ? new Date(ev.dateEvent).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      : "";
    const homeImg = ev.strHomeTeamBadge ? `<img src="${ev.strHomeTeamBadge}" alt="${home}">` : "";
    const awayImg = ev.strAwayTeamBadge ? `<img src="${ev.strAwayTeamBadge}" alt="${away}">` : "";

    return `
      <div class="match-card">
        <div class="team-block">${homeImg}<span class="team-name">${home}</span></div>
        <div class="score-block">
          <div class="score">${hs} – ${asc}</div>
          <div class="match-date">${dateStr}</div>
        </div>
        <div class="team-block away"><span class="team-name">${away}</span>${awayImg}</div>
      </div>`;
  }

  function showStatus(msg) {
    document.getElementById("matches-list").innerHTML =
      `<div class='status'><span class='spinner'></span>${msg}</div>`;
  }
}