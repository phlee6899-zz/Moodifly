const redirectUri = "https://flamboyant-bhaskara-082736.netlify.app/redirect";

// "https://flamboyant-bhaskara-082736.netlify.app/redirect";
const clientId = "bb2b70ec1664483aa816db5e011747ad";
const authEndpoint = "https://accounts.spotify.com/authorize";

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "user-library-modify",
];

export const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;
