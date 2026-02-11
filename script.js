const client_id = 'YOUR_CLIENT_ID'; // Dapat dari Spotify Developer
const redirect_uri = window.location.origin;
const scopes = ['user-read-private', 'user-read-email'];

let accessToken = null;

// Login
document.getElementById('login').addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${scopes.join('%20')}`;
  window.location = authUrl;
});

// Ambil token dari URL
window.onload = () => {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1).split('&').reduce((acc, cur) => {
      const [key, value] = cur.split('=');
      acc[key] = value;
      return acc;
    }, {});
    accessToken = hash.access_token;
    localStorage.setItem('spotify_token', accessToken);
    window.location.hash = '';
  } else {
    accessToken = localStorage.getItem('spotify_token');
  }
}

// Search lagu
document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('search').value;
  if (!query || !accessToken) return alert('Login & enter search query!');

  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  displaySongs(data.tracks.items);
});

// Display songs & play preview
const audioPlayer = document.getElementById('audioPlayer');
const currentSong = document.getElementById('currentSong');

function displaySongs(tracks) {
  const songsContainer = document.getElementById('songs');
  songsContainer.innerHTML = '';

  tracks.forEach(track => {
    const div = document.createElement('div');
    div.className = 'song';
    div.innerHTML = `
      <img src="${track.album.images[0].url}" alt="${track.name}">
      <h3>${track.name}</h3>
      <p>${track.artists.map(a => a.name).join(', ')}</p>
    `;

    // Play preview on click
    div.addEventListener('click', () => {
      if(track.preview_url){
        audioPlayer.src = track.preview_url;
        audioPlayer.play();
        currentSong.textContent = `${track.name} - ${track.artists.map(a => a.name).join(', ')}`;
      } else {
        alert('Preview not available for this track.');
      }
    });

    songsContainer.appendChild(div);
  });
}
