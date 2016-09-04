#! /usr/bin/env node
const vorpal = require("vorpal")()
const fs = require("fs")
const utils = require("./utils")
const twilio = require("twilio")

utils.readCredentialsFromDisk().then(config => {
    const client = twilio(config.twilioSid, config.twilioToken)
    const lookupClient = new twilio.LookupsClient(config.twilioSid, config.twilioToken)

    vorpal
        .command("send <number> <message>", "Send sms message to specified number", {})
        .types({
            string: ["number", "message"]
        })
        .validate(function(args) {
            utils.validateNumber(args.number, lookupClient).then(function(resp) {
                if (typeof resp !== "object") {
                    return true
                } else {
                    vorpal.log("The number you entered is invalid")
                    return false
                }
            })
        })
        .action(function(args, cb) {
            client.sendMessage({
                to: "+" + args.number, //MONKEY PATCHED AUTOCONVERT OF ARG TYPE ERROR
                from: config.phoneNumber,
                body: args.message
            }).then(resp => {
                cb()
            }, err => {
                vorpal.log(err)
            })
        })

    vorpal
        .catch("", 'Catches empty command')
        .action(function(args, cb) {
            this.log("Please enter a command (Enter \"help\" for full list)")
            cb();
        })

    //Parse command-line arguments
    vorpal
        .delimiter("sms-prompt$")
        .parse(process.argv)
})