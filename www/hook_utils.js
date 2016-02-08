module.exports = {
    parseCmd: function (cmd) {
        var length = cmd.length;
        var ix = 0;
        var simpleQuoteOpened = false;
        var doubleQuoteOpened = false;
        var words = [];
        var word = "";
        for (var ix = 0; ix < length; ix++) {
            var c = cmd[ix];
            if (c === "'") {
                simpleQuoteOpened = !simpleQuoteOpened;
            } else if (c === '"') {
                doubleQuoteOpened = !doubleQuoteOpened;
            } else if (c === ' ') {
                if (simpleQuoteOpened || doubleQuoteOpened) {
                    // noop
                } else {
                    words.push(word);
                    word = "";
                    continue;
                }
            }
            word += c;
        }

        if (word.length > 0) {
            words.push(word);
        }

        return words;
    },
    extractCordovaBuildInfo: function (words) {

        //node C:\\Users\\touvr\\AppData\\Roaming\\npm\\node_modules\\vs-tac\\app.js build 
        //         --platform Windows-x86 
        //         --configuration Debug 
        //         --projectDir . 
        //         --projectName EduLib.Reader.Cordova 
        //         --npmInstallDir C:\\Users\\touvr\\AppData\\Roaming\\npm 
        //         --language en-US --x86

        var platform = null;
        var configuration = null;
        var arch = null;

        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word === "--platform") {
                platform = words[i++ + 1];
            } else if (word === "--configuration") {
                configuration = words[i++ + 1];
            } else if (word === "--x86") {
                arch = "x86";
            } else if (word === "--x64") {
                arch = "x64";
            } else if (word === "--ARM") {
                arch = "ARM";
            } else if (word === "--AnyCPU") {
                arch = "AnyCPU";
            }
        }

        return {
            platform: platform,
            configuration: configuration,
            arch: arch
        }
    }
};