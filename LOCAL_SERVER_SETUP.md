
# Local Server Setup for Macro Analysis Dashboard

This setup allows you to store your macro analysis data on your local PC instead of browser storage.

## Setup Instructions

### 1. Install Node.js
Download and install Node.js from https://nodejs.org (if not already installed)

### 2. Set up the Local Server
1. Copy the `local-server.js` and `server-package.json` files to a folder on your PC
2. Rename `server-package.json` to `package.json`
3. Open a terminal/command prompt in that folder
4. Run: `npm install`

### 3. Start the Local Server
Run: `npm start`

You should see: "Local server running on http://localhost:3001"

### 4. Keep the Server Running
Keep this terminal window open while using the website. The server needs to be running for data storage to work.

## How it Works

- **Data Storage**: All your macro scores are saved to a file called `macro-scores.json` in the server folder
- **Backup**: If the server is not running, the app will fall back to browser storage
- **Port**: The server runs on port 3001 (you can change this in the code if needed)

## File Locations

- **Server files**: Where you copied `local-server.js` and `package.json`
- **Data file**: `macro-scores.json` (created automatically in the server folder)

## Troubleshooting

- **Server not connecting**: Make sure the server is running and no other app is using port 3001
- **CORS errors**: The server is configured to allow all origins for local development
- **Data not saving**: Check the terminal running the server for error messages
