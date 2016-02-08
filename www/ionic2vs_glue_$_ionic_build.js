#!/usr/bin/env node

var util = require('./hook_utils.js');

module.exports = function (context) {

    console.log('ionic2vs_glue_$_ionic_build.js is running...');
    var fs = context.requireCordovaModule('fs');
    var path = context.requireCordovaModule('path');
    var exec = context.requireCordovaModule('child_process').exec;
    var Q = context.requireCordovaModule('q');
    var deferral = new Q.defer();

    var projectRoot = context.opts.projectRoot;
    var cmdLine = context.cmdLine;
    var words = util.parseCmd(cmdLine); 
    var cbi = util.extractCordovaBuildInfo(words);

    if (!cbi.platform) {
        // non vs build...
        return 0;
    }

    var ionicPlatform = cbi.platform;
    if (cbi.platform.indexOf("Windows-") === 0) {
        ionicPlatform = "windows";
    } 

    var after = function(error, stdout, sderr) {
        if (error) {
            console.log("error");
            deferral.reject(error);
        } else {
            console.log("ok!");
            deferral.resolve();
        }
    };

    var process = exec("ionic build " + ionicPlatform, function(error, stdout, sderr) {
        if (error) {
            console.log("error");
            deferral.reject(error);
        } else {
            console.log("ok!");
            deferral.resolve();
        }
    });
    process.stdout.on("data", function(data) {
        console.log(data);
    });
    process.stderr.on("data", function(data) {
        console.error(data);
    });

    return deferral.promise;
};
