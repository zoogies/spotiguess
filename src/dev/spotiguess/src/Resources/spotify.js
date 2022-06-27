const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = process.env.REACT_APP_CALLBACK_ADDRESS
const clientId = "03f7867600344088955c5b0f5a502c60";

const scopes = [
  "user-top-read"
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;

// loginUrl = "https://accounts.spotify.com/authorize?client_id=YourClientId&response_type=code&redirect_uri=https://localhost:3000/&scope=streaming%20user-read-email%20user-read-private"