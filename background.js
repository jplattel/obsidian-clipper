chrome.browserAction.onClicked.addListener(function (tab) {

	// for the current tab, inject the "automate.js" file & execute it
    // chrome.tabs.executeScript(tab.ib, {
    //     file: 'obsidian.js'
    // });
    const VAULT_NAME = 'obsidian'
    const CLIPPING_NOTE_NAME = 'Chrome Inbox'

    chrome.tabs.create({'url': `obsidian://vault/${VAULT_NAME}/${CLIPPING_NOTE_NAME}`});

});