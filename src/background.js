// This runs in the background.. waiting for the icon to be clicked.. 
// It then loads the libraries required and runs the clip.js script.
// clip.js copies the content and adds it to your clipboard
// Then this script creates a new tab with a redirect that opens the
// Obsidian vault with the specified note.

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(null, { file: "lib/webbrowser-polyfill.js" }, function() { // https://unpkg.com/webextension-polyfill@0.6.0/dist/browser-polyfill.js
    chrome.tabs.executeScript(null, { file: "lib/jquery.js" }, function() { // https://code.jquery.com/jquery-3.5.1.min.js
    chrome.tabs.executeScript(null, { file: "lib/rangy.js" }, function() { // https://raw.githubusercontent.com/timdown/rangy/1.3.0/lib/rangy-core.js
    chrome.tabs.executeScript(null, { file: "lib/turndown.js" }, function() { // https://unpkg.com/turndown@7.0.0/dist/turndown.js

        // Get the vault and note name configured in the settings, 
        // defaulting to `obsidian` and `Chrome Clippings` respectively
        chrome.storage.sync.get({
            obsidianVaultName: 'obsidian',
            obsidianNoteName: 'Chrome Clippings',
        }, function(options) {

            // Get vault & note from settings:
            const VAULT_NAME = options.obsidianVaultName;
            const CLIPPING_NOTE_NAME = options.obsidianNoteName;

            options.obsidianNoteName

            // Copy current selection on the webpage we are currently on
            chrome.tabs.executeScript(tab.ib, {file: 'clip.js'}, function(clip){

                // Redirect to page (which opens obsidian).
                redirectUrl = `https://jplattel.github.io/obsidian-clipper/clip-to-new.html?vault=${VAULT_NAME}&note=${CLIPPING_NOTE_NAME}&content=${clip}`            

                // Create and remove the extra tab:
                chrome.tabs.create({ url: redirectUrl , active: false},function(obsidianTab){
                    // Close the tab after one second..
                    setTimeout(function() { chrome.tabs.remove(obsidianTab.id) }, 1000);
                });
            });
            
            
            
        });

    });
    });   
    });
    });
});
