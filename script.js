import Matches from './matches.js';
import Players from './players.js'
const mode = document.getElementById("back-mode");
mode.addEventListener('click', () => {
  const isDark = document.body.className === "body-dark";
  document.body.className = isDark ? "body-light" : "body-dark";
  mode.textContent = isDark ? "Light Mode" : "Dark Mode";
});
 

document.getElementById("matches").addEventListener('click', Matches);
document.getElementById("players").addEventListener('click',Players)