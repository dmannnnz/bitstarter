#!/usr/bin/env node

var sys =  require('util');
var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var HTMLURL_DEFAULT = "http://calm-waters-3857.herokuapp.com";
var CHECKSFILE_DEFAULT = "checks.json";
var TMP_FILE = "tmp.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(url) {
    console.log('*** assertUrlExists start.');
    rest.get(url.toString()).on('complete', function(result) {
        if (result instanceof Error) {
            sys.puts('error: ' + result.message);
            console.error(result);
        } else {
            sys.puts(result);
            fs.writeFile(TMP_FILE, result);
            console.log(result);
        }
    });
    return TMP_FILE;
}

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

// main
// NAA. Note:
// 1. remove default args for --file and --url to force explicit args
// 2. use temporary file to serialize out GET REST call to serialize locally.
// 3. assume tmp file
if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists) )
        .option('-u, --url <url>', 'Path to URL', clone(assertUrlExists) )
        .parse(process.argv);

    if (program.file) {
        console.log("--file as: " + program.file);
        var checkJson = checkHtmlFile(program.file, program.checks);
    }
    if (program.url) {
        console.log("--url as: " + program.url);
        var checkJson = checkHtmlFile(TMP_FILE, program.checks);
    }
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
