const url = "https://api.football-data.org/v4/matches";

fetch(url, {
    method: "GET",
    headers: {
        "X-Auth-Token": "114917162a8246d490e324cecec484b4"
    }
})
.then(res => res.json())
.then(data => {
    const date=document.getElementById("date");
    date.textContent=`Date: ${data.filters.dateFrom}- ${data.filters.dateTo}`
    const container = document.getElementById("matches");

    data.matches.slice(0, 10).forEach(dat => {

        const div = document.createElement("div");
        div.classList.add("match");

        div.innerHTML = `
            <h3>${dat.homeTeam.name} vs ${dat.awayTeam.name}</h3>
            <p>Status: ${dat.status}</p>
        `;

        container.appendChild(div);
    });
})
.catch(err => {
    console.log(err);
});