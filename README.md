[![Google Drive API](https://img.shields.io/badge/Google%20Drive%20API-v3-blue?style=for-the-badge&logo=google-drive&logoColor=white)](https://developers.google.com/drive)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

# Node-File-Sharing-Api-GDrive
a simple file sharing application using node js and google drive API.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/username/repository-name.git
   cd repository-name
   
2. Install dependencies:

   ```bash
   npm install

## Configuration

1. **Configure the Google Drive API:**

    - Make `.env` file and fill in the .env according to apikey.json obtained from Google API as in .envexample

2. **Configure the domain:**

    - Navigate to the `index.js` directory.
    
    - Configure `const qrCodeText = `<YOUR_DOMAIN>`/download/${requestedFileId}';` according to your domain.

## Running the Application

1. Run

   ```bash
   node index.js

## Disclaimer
This project was insipred by [@YuukioFuyu](https://github.com/YuukioFuyu)
<p>This project was formed from my initiative to learn.</p>
