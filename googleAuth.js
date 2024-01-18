require("dotenv").config();
const { google } = require("googleapis");

async function authorize() {
  const SCOPE = ["https://www.googleapis.com/auth/drive"];

  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_API_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_API_PRIVATE_KEY,
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
}

module.exports = {
  authorize,
};
