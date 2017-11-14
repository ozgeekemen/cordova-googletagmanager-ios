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

console.log('\x1b[40m');
log(
  'Running addGtmContainerFolderToTarget hook, patching xcode project 🦄 ',
  'start'
);

module.exports = function(context) {
  var xcode = context.requireCordovaModule('xcode');
  var Q = context.requireCordovaModule('q');
  var deferral = new Q.defer();

  var iosFolder = context.opts.cordova.project
    ? context.opts.cordova.project.root
    : path.join(context.opts.projectRoot, 'platforms/ios/');
  log('Folder containing your iOS project: ' + iosFolder, 'info');

  fs.readdir(iosFolder, function(err, data) {
    var run = function() {
      var projectFolder;
      var pbxProject;
      var projectPath;
      // Find the project folder by looking for *.xcodeproj
      if (data && data.length) {
        data.forEach(function(folder) {
          if (folder.match(/\.xcodeproj$/)) {
            projectFolder = path.join(iosFolder, folder);
          }
        });
      }

      projectPath = path.join(projectFolder, 'project.pbxproj');

      log(
        'Parsing existing project at location: ' + projectPath + ' ...',
        'info'
      );
      if (context.opts.cordova.project) {
        pbxProject = context.opts.cordova.project.parseProjectFile(
          context.opts.projectRoot
        ).xcode;
      } else {
        pbxProject = xcode.project(projectPath);
        pbxProject.parseSync();
      }

      // path of the container folder which we want to add as a resource
      var containerConfigPath = path.join(iosFolder, 'container');
      // find the uuid of cordovas "CustomTemplate" group
      var pbxGroupKey = pbxProject.findPBXGroupKey({ name: 'CustomTemplate' });
      // add our config folder as a resource file and add it to the resources build phase
      var resourceFile = pbxProject.addResourceFile(
        containerConfigPath,
        {},
        pbxGroupKey
      );

      if (resourceFile) {
        log('Successfully added container folder to project!', 'info');
      }

      log('Writing the modified project back to disk ...', 'info');

      // Write the modified project back to disc
      fs.writeFileSync(projectPath, pbxProject.writeSync());

      log(
        'Successfully added Google Tag Manager configuration file to iOS project!',
        'success'
      );
      console.log('\x1b[0m'); // reset

      deferral.resolve();
    };

    if (err) {
      log(err, 'error');
    }

    run();
  });

  return deferral.promise;
};
