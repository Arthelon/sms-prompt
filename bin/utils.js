const path = require("path")
const os = require("os")
const BASE_PATH = path.join(os.homedir(), ".sms-prompt.json")
const fs = require("fs")
const inquirer = require("inquirer")
const twilio = require("twilio")

const resetCredentials = () => {
    return inquirer.prompt([
        {type: "input", "name": "twilioSid", message: "Enter twilio SID"},
        {type: "input", "name": "twilioToken", message: "Enter twilio auth token"},
        {type: "input", "name": "phoneNumber", message: "Enter your phone number", validate: function(number) {
            const done = this.async()
            validateNumber(number).then(valid => {
                if (valid) {
                    done(null, true)
                } else {
                    done("the number you entered is invalid")
                }
            })
        }}

    ]).then(config => {
        fs.writeFile(BASE_PATH, JSON.stringify(config), (err) => {
            if (err)
                console.log(err)
        })
        return config
    })
}

const readCredentialsFromDisk = () => {
    return new Promise((resolve) => {
        try {
            const configFileStats = fs.statSync(BASE_PATH)
            if (!configFileStats.isFile()) {
                resetCredentials().then(config => {
                    resolve(config)
                })
            } else {
                resolve(JSON.parse(fs.readFileSync(BASE_PATH, 'utf-8')))
            }
        } catch (err) {
            if (!(err && err.code === 'ENOENT')) {
                console.log("Unknown error occurred")
            }
            return resetCredentials().then(config => {
                resolve(config)
            })
        }
    })
}

const validateNumber = (number, client) => {
    if (!client) {
        client = new twilio.LookupsClient("string", "token")
    }
    return client.phoneNumbers(number).get().then(number => {
        return true
    }, err => {
        return false
    })
}

Object.assign(exports, {
    validateNumber,
    resetCredentials,
    readCredentialsFromDisk
})