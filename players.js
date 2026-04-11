export default function Players() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <div id="src">
      <input type="text" id="search" placeholder="Enter player's name">
      <span><button id="search-btn">Search</button></span>
    </div>
    <div id="playerBox"></>
  `;
  document.getElementById("search-btn").addEventListener("click", async function () {
      const box=document.getElementById("playerBox");
      box.innerHTML="";
      const val = document.getElementById("search").value;

      if (!val) {
        alert("Enter a player's name");
        return;
      }

      const Name = val.trim();

      try {
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(Name)}`
        );

        let data = await response.json();
        if(data.player[0].strSport!="Soccer"){
          return alert("Player not found.")
        }
        box.innerHTML=playerCard(data);
        console.log(data);

        function playerCard(ev){
          return `
            <div id="player-img-box">
            <img id="playerImg" src=${ev.player[0].strCutout}>
            </div>
            <div id="info">
            <div id="playerName">Name: ${ev.player[0].strPlayer}</div>
            <div id="playerPos">Position: ${ev.player[0].strPosition}</div>
            <div id="playerGen">Gender: ${ev.player[0].strGender}</div>
            <div id="playerBorn">Birth: ${ev.player[0].dateBorn}</div>
            <div id="playerTeam">Team: ${ev.player[0].strTeam}</div>
            </div>
        `
        }

      } catch (error) {
        console.error(" Invalid Player Name " );
      }
    });
}