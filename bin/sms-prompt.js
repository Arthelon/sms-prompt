#! /usr/bin/env node
const vorpal = require("vorpal")()
const fs = require("fs")
const utils = require("./utils")

let config = utils.readCredentialsFromDisk()

vorpal
    .command("send", "Send sms message", {})
    .action(function(args, cb) {
        if (!Object.keys(config).length)
            utils.setCredentials(this)
    })

//Parse command-line arguments
vorpal
    .delimiter("sms-prompt$")
    .parse(process.argv)