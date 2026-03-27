const API_KEY = "TA_CLE_API"; // Remplace par ta clé YouTube API
let drivingMode = false;

// Favoris stockés localement
let favorites = JSON.parse(localStorage.getItem("teslatubeFavorites") || "[]");

// Recommandations simples basées sur historique
let history = JSON.parse(localStorage.getItem("teslatubeHistory") || "[]");

// Charger catégories avec preview
async function loadCategory(containerId, query) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${query}&key=${API_KEY}`);
  const data = await res.json();
  const html = data.items.map(v => `
    <div class="card" onclick="playVideo('${v.id.videoId}')">
      <img src="${v.snippet.thumbnails.medium.url}" alt="${v.snippet.title}">
      <img class="preview" src="assets/preview.gif" alt="preview">
      <button onclick="addFavorite('${v.id.videoId}', event)">⭐</button>
    </div>
  `).join("");
  document.getElementById(containerId).innerHTML = html;
}

// Lecture vidéo
function playVideo(id) {
  history.push(id);
  localStorage.setItem("teslatubeHistory", JSON.stringify(history));
  if(drivingMode) enableAudioMode(id);
  else enableVideoMode(id);
}

// Mode vidéo
function enableVideoMode(id) {
  document.getElementById("player").innerHTML = `
    <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen></iframe>
  `;
}

// Mode audio (conduite)
function enableAudioMode(id) {
  document.getElementById("player").innerHTML = `
    <div style="padding:30px; text-align:center;">
      <h2>🔊 Mode Conduite</h2>
      <p>Vidéo désactivée pour sécurité</p>
      <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen></iframe>
    </div>
  `;
}

// Ajouter aux favoris
function addFavorite(id, e) {
  e.stopPropagation();
  if(!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem("teslatubeFavorites", JSON.stringify(favorites));
    loadFavorites();
  }
}

// Afficher favoris
function loadFavorites() {
  const html = favorites.map(id => `
    <div class="card" onclick="playVideo('${id}')">
      <iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>
    </div>
  `).join("");
  document.getElementById("favorites").innerHTML = html;
}

// Charger catégories
loadCategory("trending", "trending videos");
loadCategory("music", "music videos");
loadCategory("tech", "technology reviews");
loadFavorites();

// Simuler mode conduite pour test
setInterval(() => { drivingMode = !drivingMode; }, 10000);