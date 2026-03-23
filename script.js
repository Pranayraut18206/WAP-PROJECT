document.getElementById("filter").addEventListener("change", getMatches);

function getMatches() {
    const id = document.getElementById("filter").value;
    const container = document.getElementById("matches");

    if (!id) {
        alert("Select a league");
        return;
    }

    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${id}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        container.innerHTML = "";

        if (!data.events) {
            container.innerHTML = "<p>No matches available</p>";
            return;
        }

        data.events.slice(0, 10).forEach(match => {
            const div = document.createElement("div");
            div.classList.add("match");

            div.innerHTML = `
                <h3>${match.strHomeTeam} vs ${match.strAwayTeam}</h3>
                <p>Date: ${match.dateEvent}</p>
                <p>Time: ${match.strTime}</p>
            `;

            container.appendChild(div);
        });

    })
    .catch(err => console.log(err));
}