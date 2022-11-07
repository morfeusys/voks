const express = require("express")
const telegram = require("./modules/telegram.js")

const port = process.env.PORT || 8000;
const app = express()
const bot = telegram(process.env.TELEGRAM_BOT_TOKEN)

app.use(express.json())

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.post("/", (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Webhook is listening on ${port}`);
})

