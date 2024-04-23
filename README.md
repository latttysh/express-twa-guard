# TwaGuardMiddleware

**TwaGuardMiddleware** is an Express.js middleware designed to protect routes using data passed from the Telegram Web App.

## Installation

Install `TwaGuardMiddleware` via npm:

npm install twa-guard-middleware

## Usage

```javascript
const express = require('express');
const { TwaGuardMiddleware } = require('twa-guard-middleware');

const app = express();

// Using the middleware
app.use(TwaGuardMiddleware({
    telegramBotToken: 'YOUR_TELEGRAM_BOT_TOKEN'
}));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

Options
TwaGuardMiddleware accepts an options object with the following parameters:

telegramBotToken: (Required) Your Telegram bot token.
header: (Optional) The name of the header containing Telegram data. Default: "telegram-data".
failedStatusCode: (Optional) The HTTP status code to be returned in case of failed validation. Default: 401.
failedStatusText: (Optional) The HTTP status text to be returned in case of failed validation. Default: "Unauthorized".
How It Works
The middleware checks for the presence of the telegram-data header in the request. It then extracts the data and verifies its integrity using HMAC with a secret key and SHA-256 hash. If the data passes validation, the user object is extracted from the request and added to req.user.

License
MIT © Your Name
```
