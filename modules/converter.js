const request = require('request')

module.exports = {
    convert: stream => {
        let form = {
            method: "POST",
            url: "https://s1.fconvert.ru/fconvert.php",
            port: 443,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            formData : {
                "file" : stream,
                "filelocation": "local",
                "target": "WAV",
                "bitrate": "128k",
                "frequency": 8000,
                "channel": 1,
                "type_converter": "audio"
            }
        };
        return new Promise((resolve, reject) => {
            request(form, function (err, res, body) {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(body))
                }
            })
        })
    },

    fetch: id => request("https://s1.fconvert.ru/upload/"+id+"/")
}