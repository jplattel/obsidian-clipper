

chrome.browserAction.onClicked.addListener(function (tab) {

    chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {

        chrome.storage.sync.get({
            obsidianVaultName: 'obsidian',
            obsidianNoteName: 'Chrome Clippings',
        }, function(options) {

            // Get vault & note from settings:
            const VAULT_NAME = options.obsidianVaultName;
            const CLIPPING_NOTE_NAME = options.obsidianNoteName;

            // Copy current selection
            chrome.tabs.executeScript(tab.ib, {file: 'copy.js'});

            // Redirect to page (which opens obsidian).
            url = `https://jplattel.github.io/obsidian-clipper/clip.html?vault=${VAULT_NAME}&note=${CLIPPING_NOTE_NAME}`
            
            // Create and remove the extra tab:
            chrome.tabs.create({ url: url , active: false,},function(obsidianTab){
                setTimeout(function(){chrome.tabs.remove(obsidianTab.id);}, 1000);
            });
            
        });
        
    })
    
});
