export default function Players() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <div id="src">
      <input type="text" id="search" placeholder="Search Players">
      <span><button id="search-btn">Search</button></span>
    </div>
  `;

  document.getElementById("search-btn").addEventListener("click", async function () {
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

        const data = await response.json();
        console.log(data);


      } catch (error) {
        console.error("Error:", error);
      }
    });
}