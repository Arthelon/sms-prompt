#! /usr/bin/env node
const vorpal = require("vorpal")()
const fs = require("fs")
const utils = require("./utils")
const twilio = require("twilio")

utils.readCredentialsFromDisk().then(config => {
    const client = twilio(config.twilioSid, config.twilioToken)
    const lookupClient = new twilio.LookupsClient(config.twilioSid, config.twilioToken)

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

        })

    //Parse command-line arguments
    vorpal
        .delimiter("sms-prompt$")
        .parse(process.argv)
})