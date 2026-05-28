# Mumbai Mafia

A turn-based RPG built with Cordova and vanilla JavaScript for Android.

## How to Run

Install Cordova globally.

```
npm install -g cordova
```

Set these environment variables on Windows.

```
ANDROID_HOME = C:\Users\<user>\AppData\Local\Android\sdk
ANDROID_SDK_ROOT = C:\Users\<user>\AppData\Local\Android\sdk
JAVA_HOME = C:\Program Files\OpenLogic\jdk-17.0.18.8-hotspot
```

Build the APK.

```
cordova prepare android --no-build
cd platforms/android
gradlew assembleDebug
```

The APK is at platforms/android/app/build/outputs/apk/debug/app-debug.apk.

For quick desktop testing, use cordova run browser.

## What It Does

Login with any username to enter the game. You start at level 0 with five characters: Vex, Inferna, Titan, Phantom, and Glitch. Each has a unique special ability used in combat.

### Territory Map

- Six themed areas with full-screen backdrop images and three enemies each
- Must beat enemies in sequence to reach the boss
- Defeated enemies stay defeated, you cannot fight them again
- Areas unlock as your player level increases

### Battle System

- Turn-based combat with attack, special, heal, and flee options
- Five bandages per fight for emergency healing
- Enemies have six different ability types: multi-hit attacks, execution damage when you are low on HP, dodge and counter, critical hit or self-heal gamble, self-rage boost, and stacking poison damage
- Full HP restore on victory
- Bottom navigation is locked during a fight so you cannot accidentally leave

### Weapon Upgrades

- Earn gold by defeating enemies on the map
- Spend gold in the Armory tab to level up weapons
- Each level increases damage output
- Max level is 20 per weapon

### Crew Showcase

- Full-screen viewer for each character
- Vex plays an animated video background that loads invisibly and fades in when ready
- Other characters use static artwork
- Horizontal chip selector at the top to switch between crew members

### Audio

- Normal background music plays during menus
- Battle music activates when the arena launches
- Tracks swap seamlessly on fight start and end

## Project Structure

The main game code lives inside the www folder.

```
www/
  index.html
  audio/        - normal.mp3 and battle.mp3
  css/app.css   - all styles
  img/
    character-WB/   - character and enemy sprites
    mapImage/       - territory backdrop images
    weapons/        - weapon card images
  video/character/  - Vex animation file
  js/
    app.js          - main controller, navigation, music, top bar
    tab-battle.js   - combat system, enemy AI, auto-launch from map
    tab-map.js      - territories, roadmap, fight launcher
    tab-items.js    - weapon detail overlay and upgrade system
    tab-crew.js     - character showcase viewer
    login.js        - mock login screen
```

## Challenges Faced


CSS changes do not trigger a Gradle recompile. Every style fix required running cordova prepare android again before building, otherwise the old CSS would ship in the APK.

The video element in the Crew tab shows a dark play-button placeholder while buffering. This was fixed by putting the video source directly in the HTML so buffering starts immediately, and hiding the element with CSS until the canplay event fires.
