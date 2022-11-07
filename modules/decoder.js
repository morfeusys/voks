const websocket = require('ws')
const converter = require('./converter.js')

module.exports = url => {
    function decode(id) {
        console.log("decoding...")
        return new Promise((resolve, reject) => {
            let ws = new websocket(url)
            ws.on('open', function open() {
                var text = ""
                let stream = converter.fetch(id)
                stream.on('data', (chunk) => {
                    ws.send(chunk)
                })
                stream.on('end', () => {
                    ws.send('{"eof" : 1}')
                })
                ws.on('message', (data) => {
                    let result = JSON.parse(String(data))
                    if (result["text"]) {
                        text += result["text"] + " "
                    }
                });
                ws.on('close', () => {
                    resolve(text)
                });
            })
        })
    }

    return {
        decode: stream => {
            return new Promise((resolve, reject) => {
                console.log("converting...")
                converter.convert(stream).then((data) => {
                    if (data["state"] === "SUCCESS") {
                        let result = decode(data["id"])
                        resolve(result)
                    } else {
                        reject("cannot convert")
                    }
                }, (err) => {
                    console.log("cannot convert " + err)
                    reject(err)
                })
            })

        }
    }
}