# Creating an app for the Cheesgle Byte One
Your app's directory is `/app`. It starts with a blank "Hello, World!" page with an icon.

## Package.json
If package.json is not valid or missing required keys, the app will experience issues, crash, or not show on the home screen.

Here's an example package.json.

```json
{
  "v": 1,
  "title": "My App",
  "description": "Example app for Cheesgle Byte One",
  "author": "Example",
  "version": 0.1,
  "homepage": "",
  "repository": "",

  "category": "Utility",
  "screenshot": "screenshot.png",

  "entrypoint": "index.html",
  "icon": "icon.png",

  "color": "#FFFFFF",
  
  "permissions":[]
}
```

`v` is the version of package.json and should always be left at `1`.

`version` is the version of the app and should always be a number.

`title` is the title of the app, shown on the home screen and in the app store.

`description` and `author` are shown in the app store.

`screenshot` is a screenshot of the app shown in the app store.

`category` is the category in the app store, choose from the following: "Utility", "Game", "Social", or "Productivity".

`entrypoint` is the HTML file your app will open with.

`icon` is the icon for the app.

`color` or `colour` is the color of the top notch when running the app

`permissions` are explained below.

## Permissions
Each app is executed in a sandboxed iframe, and the app can request further permissions from the system with the `permissions` value in `package.json`.

The current supported permissions are as follows:
- `sameOrigin` is the Administrator mode for apps, allowing them to interact with the phone fully. [Learn more about what this means](https://javascript.info/cross-window-communication).
- `openOtherApps` allows the app to launch other apps with `parent.postMessage({ type: "launchApp", app: "/app/location/without/ending/slash" }, "*")`. This only allows the opening of apps on the system and can't be used to open the home screen or the boot app.
- `noHomeButton` hides the home button within the app.
- `openSitesOnComputer` allows the app to open websites on the user's computer (documented below)

## Communication with the phone
The phone uses `postMessage` to communicate with your app. When the app fully loads, the system will send an `info` message, like so:

```js
window.addEventListener('message', async function(e) {
  data = e.data // Get the data from the message event

  switch (data.type) {
    case 'info':
      console.log(data)
    break;
  }
})
```

The data will contain something like the following:
```json
{
  "type": "info",
  "package": "THE APP'S PACKAGE.JSON",
  "phone": {
    "version": 0.1,
    "name": "Cheesgle Byte One",
    "contributors": "coding398",
    "isLoggedIn": true
  },
  "phoneApps": [
    "/sys/apps/settings",
    "/app"
  ],
  "savedAppData": ""
}
```

Here are some other ways to communicate with the phone
### Save app data
You can save data to the phone that's loaded in the info event under `savedAppData` by using the following:
```js
parent.postMessage({ type: "setAppData", data: "Wow, data saved here will be loaded when the app is next loaded!" }, "*");
```

### Request Replit data
Using `parent.postMessage({ type: "requestReplit" }, "*");` will request Replit data from the system. If the user is signed out, it will prompt a sign in, so preferably only use if the phone's info shows that the user is currently logged in.

If the user is signed out, the system will open a Replit sign-in window. The request will have to be fired a second time afterwards due to technical limitations.

If the user is signed in, the system will fire a `replitInfo` event like the following:
```json
{
  "type": "replitInfo",
  "data": {
    "loggedIn": true,
    "name": "ReplitUsername",
    ... other fields can be found at https://cheesgle-byte-one-dev-kit.codingmaster398.repl.co/__replauthuser
  }
}
```

**IMPORTANT: Never trust the data from replitInfo if you're trying to make an online app! It can be easily tampered with. Use something else, like username or password, or a "open the [online service] on your computer, sign in and put in the code it gives you". If your app doesn't do this it won't be accepted to the store.**

### Close the app
Close the app with `parent.postMessage({type:"close"},"*")`.

**If the user closes the app with a feature such as the home button**, your app will recieve a message with the type of `closing` and close ~500ms later

### Launch another app
Launching another app requires the `openOtherApps` permission.

Launch another app with `parent.postMessage({ type: "launchApp", app: "/app/location/without/ending/slash" }, "*")`. This only allows the opening of apps on the system and can't be used to open the home screen or the boot app.

### Open websites on computer
Requires `openSitesOnComputer` permission.

Launch a site in a new tab on the user's computer with `parent.postMessage({ type: "openSiteOnComputer", site:"https://google.com/" }, "*")`.