const clientID = "7f5d3bc4a5a943f19af817551e63b6be";
const clientSecret = "145df93edad84a719dc3f5feeb11c809";

async function getAccessToken(){
    const authBasic = btoa(`${clientID}:${clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authBasic}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    return data.access_token;
}

const getPlaylistDetails = async (access, playlistID, limit = 100) => {
  try {
    let offset = 0;
    let t = [];
    while(true){
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=${limit}&offset=${offset}`, 
          {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${access}`
            }
          });
      const playlist = await response.json();
      if(playlist.items.length === 0){
        break;
      }
      else{
        t = [...t, ...playlist.items];
        offset += limit;
      }
    }
    return t;
  } catch (error) {
    console.error('Error:', error);
  }
};

async function main() {
  id = "4H9GNs2XK0RfohZsrSiaLt";
  const accessToken = await getAccessToken();
  const playlist = await getPlaylistDetails(accessToken, id);
  return playlist;
} 


(async function() {
  let artists = [];
  const tracks = await main();
  tracks.forEach(song => {
    try{
    if(song.artists){
      artists.push(song.track.artists); }
    } catch(error) {
      console.log("Error", error);
    }
  });
  console.log(artists);
  artists.forEach(a => {
    a.forEach(b => {
      console.log(b.name);
    });
  });
})();

