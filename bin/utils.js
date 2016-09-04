const path = require("path")
const os = require("os")
const BASE_PATH = path.join(os.homedir(), ".sms-prompt.json")
const fs = require("fs")

const resetCredentials = () => {
    fs.writeFile(BASE_PATH, "{}", (err) => {
        if (err) {
            console.log(err)
        }
    })
}

const setCredentials = (ctx) => {
    ctx.prompt([
        {type: "input", "name": "twilio-sid", message: "Enter twilio SID"},
        {type: "input", "name": "twilio-token", message: "Enter twilio auth token"}
    ]).then(answers => {
        fs.writeFile(BASE_PATH, JSON.stringify(answers), (err) => {
            if (err)
                console.log(err)
        })
        console.log(answers)
        return answers
    })
}

const readCredentialsFromDisk = () => {
    try {
        const configFileStats = fs.statSync(BASE_PATH)
        if (!configFileStats.isFile()) {
            resetCredentials()
            return {};
        } else {
            return JSON.parse(fs.readFileSync(BASE_PATH, 'utf-8'))
        }
    } catch (err) {
        console.log(err)
        if (!(err && err.code === 'ENOENT')) {
            console.log("Unknown error occurred, reset config file")
        }
        resetCredentials()
        return {};
    }
}

Object.assign(exports, {
    setCredentials,
    resetCredentials,
    readCredentialsFromDisk
})