# cordova-plugin-googletagmanager-ios

A plugin for adding Google Tag Manager to cordova-ios projects (including adding the configuration file)

## How to install the plugin

- run `cordova plugin add https://github.com/enesyalcin/cordova-googletagmanager-ios.git --variable CONFIG_FILE_NAME="<name of your GTM json config file>" --save`

## Change the name of your config file later

- open `config.xml` and look for the following part:

```xml
<plugin name="cordova-plugin-googletagmanager-ios" spec="https://github.com/enesyalcin/cordova-googletagmanager-ios.git">
  <variable name="CONFIG_FILE_NAME" value="<GTM-xxxxxxx.json>" />
</plugin>
```

- change the value of the `CONFIG_FILE_NAME` variable to the name of your config

## Note

The plugin will copy and reference the config file everytime one of the following CLI commands is used:

- `cordova prepare`
- `cordova platform add`
- `cordova build`
- `cordova run`
