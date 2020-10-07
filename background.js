const extensionId = 'kinbjjlcnpdapllipcmnfbngdlicdlbd';

chrome.browserAction.onClicked.addListener(function (tab) {
    // TODO: create pop-up with settings
    const VAULT_NAME = 'obsidian'
    const CLIPPING_NOTE_NAME = 'Chrome Clippings'

    const PREV = window.location

    // Copy selection
    chrome.tabs.executeScript(tab.ib, {file: 'copy.js'});

    // Redirect to page (which opens obsidian).

    const obsidianTab = chrome.tabs.create({ url: `https://jplattel.github.io/obsidian-clipper/?vault=${VAULT_NAME}&note=${CLIPPING_NOTE_NAME}&prev=${PREV}`}); 
    chrome.tabs.remove(obsidianTab.id)

});