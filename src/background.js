// This runs in the background.. waiting for the icon to be clicked.. 
// It then loads the libraries required and runs the clip.js script.
// clip.js copies the content and adds it to your clipboard
// Then this script creates a new tab with a redirect that opens the
// Obsidian vault with the specified note.

chrome.action.onClicked.addListener(async function (tab) {

    // async function getCurrentTab() {/* ... */}
    // let tab = await getCurrentTab();

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [
            "lib/webbrowser-polyfill.js",
            "lib/jquery.js",
            "lib/rangy.js",
            "lib/moment.js",
            "lib/turndown.js",
        ]
    })

    // Get the vault and note name configured in the settings, 
    // defaulting to `obsidian` and `Chrome Clippings` respectively
    var defaultClippingOptions = {
        obsidianVaultName: "Obsdian",
        clipAsNewNote: true,
    }

    async function getFromStorage(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, resolve);
        })
    }

    
    chrome.runtime.onMessage.addListener(async function listener(result) {
        // Remove listener to prevent trigger multiple times
        chrome.runtime.onMessage.removeListener(listener);
        
        // Get vault & and if we clip as a new note:
        var clippingOptions = await getFromStorage(defaultClippingOptions)
        const vault = clippingOptions.obsidianVaultName;
        const clipAsNewNote = clippingOptions.clipAsNewNote;

        var noteName = result[0]
        var note = encodeURIComponent(result[1])

        let redirectUrl;
        console.log(noteName, note)
        // Redirect to page (which opens obsidian).
        if (clipAsNewNote) {
            redirectUrl = `https://jplattel.github.io/obsidian-clipper/clip-to-new.html?vault=${encodeURIComponent(vault)}&note=${noteName}&content=${encodeURIComponent(note)}`
            // console.log(redirectUrl)
        } else {
            redirectUrl = `https://jplattel.github.io/obsidian-clipper/clip.html?vault=${encodeURIComponent(vault)}&note=${noteName}`
        }

        // Create and remove the extra tab:
        chrome.tabs.create({ url: redirectUrl , active: true},function(obsidianTab){
            // Close the tab after one second..
            setTimeout(function() { chrome.tabs.remove(obsidianTab.id) }, 1000);
        });
    });

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['clip.js']
    })

});
