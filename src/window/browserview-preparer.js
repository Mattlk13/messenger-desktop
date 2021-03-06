/*
 *  Copyright 2018 Luke Klinker
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function() {

  const spellCheck = require('../spellcheck/spellcheck-provider.js')
  const websocketPreparer = require('../websocket/websocket-preparer.js')
  const preferences = require('../preferences.js')

  var prepare = (window, browser) => {
    browser.setBounds( { x: 0, y: 0, width: window.getBounds().width, height: window.getBounds().height - getTitleBarSize(window) } )
    browser.setAutoResize( { width: true, height: true } )
    browser.webContents.loadURL('https://pulsesms.app')

    browser.webContents.on('dom-ready', (event) => {
      websocketPreparer.prepare(browser)
    })

    browser.webContents.on('did-fail-load', (event) => {
      console.log("failed loading webpage");
      setTimeout(() => {
        browser.webContents.loadURL('https://pulsesms.app')
      }, 2000);
    })

    browser.webContents.on('new-window', (event, url) => {
      try {
        require('electron').shell.openExternal(url)
        event.preventDefault()
      } catch (error) {
        console.log("Ignoring " + url + " due to " + error.message)
      }
    })

    spellCheck.prepareMenu(window, browser)
  }

  function getTitleBarSize(window) {
    if (process.platform === "darwin") {
      return 20
    } else if (process.platform === "win32") {
      return preferences.autoHideMenuBar() ? 40 : 60
    } else {
      return 0
    }
  }

  module.exports.prepare = prepare
}())
