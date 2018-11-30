# Freie Radio App

The app is a hybrid app based on "Adobe Phonegap". The App is simply just a website with javascript.

[<img src="AboutTheApp.png"
alt="Screenshot"
height="400">]

## Prerequisites

You need the following tools:
+ Node.js/npm
+ typescript
+ phonegap/cordova
+ Android SDK and or Xcode(for iOS) for testing

Optional you can install or use this tools:
+ cordova tools in VSC -> for faster testing
+ chrome -> for debugging
+ gulp -> to compile typescript 


## Installation

Clone the repository and open the folder in code editor of choice.

To install phonegap type into the terminal:
 
```
npm install -g phonegap
```
To install gulp:

```gulp
npm install gulp -D
```

## Workflow
+ Make your changes in typescript,php or CSS
+ Compile with gulp

To run on Android:
+ Connect Connect a Device or start an Emulator
+ Cordova run Android or use the plugin


### Compile with typescript
```gulp
gulp typescript
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GNU](https://choosealicense.com/licenses/gpl-3.0/)

## Useful links

http://bfrtech.critmass.de/redmine/projects/freie-radios-app/wiki/Freie_Radio_App_-_Entwickler

http://bfrtech.critmass.de/redmine/projects/freie-radios-app/wiki/Freie_Radio_App_-_User_Manual


meta.xml 
provides links to station- and program.xml of broadcasting stations participating at Freie Radio App

station-v3.xml
latest template for xml which provides station- and program-data of broadcasting stations participating at Freie Radio App

station-v4.xml 
next generation template, not used so far
