// ===========================
// Spotify Clone - Vercel Ready
// ===========================

// Ganti ini dengan Client ID Spotify kamu
const client_id = '‎BQDLhyrDsfwrkqxBlEBeSEmjwGC_xziukIRGrLcoV8xVG6-_4pOnB2Ixx9n1EMPGCflzlRDHwo-TuEcuH2R7ky9BIdKk5XbpBvcr1q-x64r9zGjRAjmmjomEeWwfT8rk83XsKVGag7RisiDLBeEotf0o3gb67sQlYcQ3QAjuwQB5nNa5LdNVXo6uQLdmoOtn9nxZr8ndIluBxPccLTUdknvQjXY79OS-UAMArJyly84nwRCZkqox6asqtggWbtONDBu35fizmBCEAUZgpxSFvAzHWgZQ7YOKpC5FtWh119G8Bw81KHGpIIBm0tt_nuskxrkD';

// Redirect URI harus sama persis dengan domain Vercel
const redirect_uri = 'https://spotify-clone-yourname.vercel.app/'; // <--- ganti dengan domain kamu
const scopes = ['user-read-private','user-read-email'];

// ===========================
// Login Spotify
// ===========================
document.getElementById('login').addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${scopes.join('%20')}`;
  window.location = authUrl;
});

// ===========================
// Ambil token dari URL / localStorage
// ===========================
let accessToken = null;

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
};

// ===========================
// Search Lagu & Display
// ===========================
document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('search').value.trim();
  if (!query) return alert('Masukkan kata kunci pencarian!');
  if (!accessToken) return alert('Login terlebih dahulu!');

  try {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await res.json();
    displaySongs(data.tracks.items);
  } catch (err) {
    console.error('Error fetching tracks:', err);
    alert('Gagal mengambil data dari Spotify API.');
  }
});

// ===========================
// Audio Player Setup
// ===========================
const audioPlayer = document.getElementById('audioPlayer');
const currentSong = document.getElementById('currentSong');

// ===========================
// Tampilkan Lagu
// ===========================
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
        alert('Preview lagu tidak tersedia.');
      }
    });

    songsContainer.appendChild(div);
  });
      }
