# cordova-plugin-firebase-tagmanager

Forked from `cordova-plugin-googletagmanager-ios` (https://github.com/enesyalcin/cordova-googletagmanager-ios.git)

A plugin for adding Google Tag Manager to cordova-ios projects that are already using `cordova-plugin-firebase`

## How to install the plugin

- run `cordova plugin add cordova-plugin-firebase-tagmanager --variable CONFIG_FILE_NAME="<name of your GTM json config file>" --save`

## Change the name of your config file later

- open `package.json` and look for the following part:

```json
"cordova-plugin-firebase-tagmanager": {
  "CONFIG_FILE_NAME": "<GTM-xxxxxxx.json>"
}
```

- change the value of the `CONFIG_FILE_NAME` variable to the name of your config
