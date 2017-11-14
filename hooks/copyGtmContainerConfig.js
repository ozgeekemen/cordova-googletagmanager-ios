// @ts-check

var fs = require('fs');
var path = require('path');

function log(logString, type) {
  var prefix;
  var postfix = '';
  switch (type) {
    case 'error':
      prefix = '\x1b[1m' + '\x1b[31m' + '💥 😨 '; // bold, red
      throw new Error(prefix + logString + 'x1b[0m'); // reset
    case 'info':
      prefix =
        '\x1b[40m' +
        '\x1b[37m' +
        '\x1b[2m' +
        '☝️ [INFO] ' +
        '\x1b[0m\x1b[40m' +
        '\x1b[33m'; // fgWhite, dim, reset, bgBlack, fgYellow
      break;
    case 'start':
      prefix = '\x1b[40m' + '\x1b[36m'; // bgBlack, fgCyan
      break;
    case 'success':
      prefix = '\x1b[40m' + '\x1b[32m' + '✔ '; // bgBlack, fgGreen
      postfix = ' 🦄  🎉  🤘';
      break;
  }

  console.log(prefix + logString + postfix);
}

function getPreferenceValue(config, name) {
  var value = config.match(
    new RegExp('name="' + name + '" value="(.*?)"', 'i')
  );
  if (value && value[1]) {
    return value[1];
  } else {
    return null;
  }
}

function getCordovaParameter(variableName, contents) {
  var variable;
  if (process.argv.join('|').indexOf(variableName + '=') > -1) {
    var re = new RegExp(variableName + '=(.*?)(||$))', 'g');
    variable = process.argv.join('|').match(re)[1];
  } else {
    variable = getPreferenceValue(contents, variableName);
  }
  return variable;
}

console.log('\x1b[40m');
log(
  'Running copyGtmContainerConfig hook, copying .json file to container folder ...',
  'start'
);

module.exports = function(context) {
  var Q = context.requireCordovaModule('q');
  var deferral = new Q.defer();
  var configXmlContents = fs.readFileSync(
    path.join(context.opts.projectRoot, 'config.xml'),
    'utf-8'
  );
  // get the name of the container config file from variable or the config file
  var CONFIG_FILE_NAME = getCordovaParameter(
    'CONFIG_FILE_NAME',
    configXmlContents
  );
  var srcFile = path.join(context.opts.projectRoot, CONFIG_FILE_NAME);

  if (!fs.existsSync(srcFile)) {
    log(
      'Missing ' + CONFIG_FILE_NAME + ' + in ' + context.opts.projectRoot,
      'error'
    );
  }

  var targetFolder = path.join(
    context.opts.projectRoot,
    'platforms',
    'ios',
    'container'
  );

  // Create the target directory
  try {
    fs.mkdirSync(targetFolder);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      log('container folder already exists, using existing ...', 'info');
    }
  }

  // Copy config file to ios project root "container" folder
  fs
    .createReadStream(srcFile)
    .pipe(fs.createWriteStream(path.join(targetFolder, CONFIG_FILE_NAME)));

  log('Successfully copied container config!', 'success');
  console.log('\x1b[0m'); // reset

  deferral.resolve();

  return deferral.promise;
};
