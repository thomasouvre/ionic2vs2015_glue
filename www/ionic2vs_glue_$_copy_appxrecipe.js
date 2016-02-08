#!/usr/bin/env node

var util = require('./hook_utils.js');

module.exports = function (context) {

    console.log('ionic2vs_glue_$_copy_appxrecipe.js is running...');
    var fs = context.requireCordovaModule('fs');
    var path = context.requireCordovaModule('path');
    var Q = context.requireCordovaModule('q');
    var deferral = new Q.defer();

    var projectRoot = context.opts.projectRoot;
    var cmdLine = context.cmdLine;
    var words = util.parseCmd(cmdLine); // parseCmd(cmdLine);
    var cbi = util.extractCordovaBuildInfo(words);

    if (!cbi.platform) {
        // non vs build...
        return 0;
    }

    if (cbi.platform.indexOf("Windows") === 0) {
        var dest = path.join("bin", cbi.platform, cbi.configuration);
        var appxrecipe = path.join("platforms/windows/build/windows", cbi.configuration.toLowerCase(), cbi.arch);
        
        (function copy(test_path, other_tests) {
            fs.readdir(test_path, function(err, files) {
                if (!files) {
                    if (other_tests.length > 0) {
                        copy(path.join(test_path, other_tests.pop()));
                    } else {
                        console.log("no files...");
                    }
                    return;
                }
                console.log(files);
                console.log(files.length);
                if (err) {
                    console.log(err);
                } else {
                    var close_hit = 0;
                    var error_hit = 0;
                    var expec_hit = files.length;
                    var after = function() {
                        if (close_hit + error_hit >= expec_hit) {
                            if (error_hit > 0) {
                                console.log("error on copy...");
                                deferral.reject("error on copy...");
                            } else {
                                console.log("ok!");
                                deferral.resolve();
                            }
                        }
                    }
                    files.forEach(function(file) {
                        var wr = fs.createWriteStream(path.join(dest, file.indexOf(".appxrecipe") >= 0 
                            ? "CordovaApp.windows80.build.appxrecipe" 
                            : file));
                        wr.on("error", function(err) {
                            console.log(err);
                            error_hit++;
                            after();
                        });
                        wr.on("close", function() {
                            close_hit++;
                            after();
                        });
                    
                        fs.createReadStream(path.join(test_path, file)).pipe(wr);
                    });
                }
            });
        })(appxrecipe, ["win8.1"]);

        return deferral.promise;
    }
    


    setTimeout(function() {
        deferral.resolve();
    }, 0);
    return deferral.promise;
};
