#! /usr/bin/env node

const vorpal = require("vorpal")()

//Parse command-line arguments
vorpal
    .show()
    .parse(process.argv)