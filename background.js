/*  This module always runs continuously in the background as part of the Chrome plugin.
    It detects a click on the action button in the browser,
    in that case, if the current and active window is web.whatsapp.com,
    it executes the script module_message_reply.js
 */


chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({
        active: true,
        currentWindow: true,
        url: "*://web.whatsapp.com/*"
    }, function(arrayOfTabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        var activeTab = arrayOfTabs[0];
        var activeTabId = arrayOfTabs[0].url;
        chrome.tabs.executeScript(null, {
            file: "module_message_reply.js"
        });
    });
    /**/
});