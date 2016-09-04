#! /usr/bin/env node
const vorpal = require("vorpal")()
const fs = require("fs")
const utils = require("./utils")
const twilio = require("twilio")

const config = utils.readCredentialsFromDisk()
const client = twilio(config["twilio-sid"], config["twilio-token"])
const lookupClient = new twilio.LookupsClient(config["twilio-sid"], config["twilio-token"])

vorpal
    .command("send <message> to <number>", "Send sms message", {})
    .types({
        string: ["message"]
    })
    .validate(function(args) {
        vorpal.log(args)
        utils.validateNumber(args.number, lookupClient).then(function(succeeded) {
            if (succeeded) {
                return true
            } else {
                vorpal.log("Invalid Number")
                return false
            }
        })
    })
    .action(function(args, cb) {
        if (!Object.keys(config).length)
            utils.setCredentials(this)
    })

//Parse command-line arguments
vorpal
    .delimiter("sms-prompt$")
    .parse(process.argv)