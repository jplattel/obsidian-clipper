// This runs in the background.. waiting for the icon to be clicked.. 
// It then loads the libraries required and runs the clip.js script.
// clip.js copies the content and adds it to your clipboard
// Then this script creates a new tab with a redirect that opens the
// Obsidian vault with the specified note.
// Load files necessary for clipping
chrome.action.onClicked.addListener(async function (tab) {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [
            "lib/webbrowser-polyfill.js",
            "lib/jquery.js",
            "lib/rangy.js",
            "lib/moment.js",
            "lib/turndown.js",
        ]
    }, () => {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['run.js']
        })
    })
});

chrome.runtime.onMessage.addListener(async function listener(result) {
    const clipAsNewNote = result.clipAsNewNote
    const vault = result.vault
    const noteName = result.noteName
    const note = encodeURIComponent(result.note)
    
    // const baseURL = 'http://localhost:8080'; // Used for testing...
    const baseURL = 'https://jplattel.github.io/obsidian-clipper'
    
    let redirectUrl;
    // Redirect to page (which opens obsidian).
    if (clipAsNewNote) {
        redirectUrl = `${baseURL}/clip-to-new.html?vault=${encodeURIComponent(vault)}&note=${encodeURIComponent(noteName)}&content=${encodeURIComponent(note)}`
    } else {
        redirectUrl = `${baseURL}/clip.html?vault=${encodeURIComponent(vault)}&note=${encodeURIComponent(noteName)}&content=${encodeURIComponent(note)}`
    }
    
    // Open a new tab for clipping through the protocol, since we cannot go from the extension to this..
    if (result.testing) {
        chrome.tabs.create({ url: redirectUrl , active: true},function(obsidianTab){
            // Since we're testing, we are not closing the tag...
        });
    } else {
        chrome.tabs.create({ url: redirectUrl , active: true},function(obsidianTab){
            setTimeout(function() { chrome.tabs.remove(obsidianTab.id) }, 500);
        });
    }
});

// On install open the options page:
chrome.runtime.onInstalled.addListener(function (object) {
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") }, function (tab) {});
    }
});