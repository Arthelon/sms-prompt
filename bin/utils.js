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
        {type: "input", "name": "phoneNumber", message: "Enter your phone number"}
    ]).then(config => {
        const client = new twilio.LookupsClient(config.twilioSid, config.twilioToken)
        new Promise((resolve, reject) => {
            validateNumber(config.phoneNumber, client).then(resp => {
                if (typeof resp !== "object") {
                    resolve()
                } else {
                    let message = resp.message
                    if (resp.status == 401) {
                        message = "Invalid credentials"
                    } else if (resp.status == 404) {
                        message = "Invalid phone number"
                    }
                    reject(message)
                }
            })
        }).then(() => {
            fs.writeFile(BASE_PATH, JSON.stringify(config), (err) => {
                if (err)
                    console.log(err)
            })
            return config
        }, err => {
            console.log(err)
        })
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
    return client.phoneNumbers(number).get().then(number => {
        return true
    }, err => {
        if (err) {
            return err
        }
    })
}

Object.assign(exports, {
    validateNumber,
    resetCredentials,
    readCredentialsFromDisk
})