const TelegramBot = require("node-telegram-bot-api")
const Decoder = require("./decoder.js")

module.exports = token => {
    let bot = new TelegramBot(token)
    let decoder = Decoder(process.env.VOSK_SERVER_URL)

    bot.setWebHook(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`)

    bot.on("text", msg => {
        bot.sendMessage(msg.chat.id, "Send me some voice note and I'll decode it to the text.");
    });

    bot.on("voice", msg => {
        let file_id = msg.voice.file_id
        let chat_id = msg.chat.id
        bot.sendMessage(chat_id, "*_Decoding\\.\\.\\. Please wait a bit_* 💬", {parse_mode: "MarkdownV2"}).then(msg => {
            decoder.decode(bot.getFileStream(file_id)).then(result => {
                if (result) {
                    console.log(result)
                    bot.editMessageText(result, {chat_id: chat_id, message_id: msg.message_id})
                } else {
                    console.log("decoding error")
                    bot.editMessageText("I cannot decode that, sorry...", {chat_id: chat_id, message_id: msg.message_id})
                }
            })
        })
    })

    return bot
}