const clientID = "7f5d3bc4a5a943f19af817551e63b6be";
const clientSecret = "145df93edad84a719dc3f5feeb11c809";

const getAccessToken = async () => {
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
};

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

const main = async () => {
  id = "4H9GNs2XK0RfohZsrSiaLt";
  const accessToken = await getAccessToken();
  const playlist = await getPlaylistDetails(accessToken, id);
  return playlist;
} 

const artistCounts = new Map();  
(async function() {
  let artists = [];
  const tracks = await main();
  tracks.forEach(song => {
    try{
        artists.push(song.track.artists); 
    } catch(error) {
      console.log("Error", error);
    }
  });
  artists.forEach(a => {
    a.forEach(b => {
        if(artistCounts.has(b.name)){
            artistCounts.set(b.name, artistCounts.get(b.name) + 1);
        }
        else
        {
            artistCounts.set(b.name, 1);
        }
    });
  });
  const sortedArtists = new Map([...artistCounts.entries()].sort((a, b) => b[1] - a[1]));

  const pieData = {
    labels: [...sortedArtists.keys()],
    datasets: 
    [
        {
            data: [...sortedArtists.values()],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#8BC34A",
                "#9C27B0",
                "#3F51B5",
                "#607D8B"
            ]
        }
    ]
}

const ctx = document.getElementById("artistChart").getContext("2d");
const artistChart = new Chart(ctx, {
    type: "pie",
    data: pieData
});

})();

