// this is the code which will be injected into a given page...
(function() {
    const VAULT_NAME = 'obsidian'
    const CLIPPING_NOTE_NAME = 'Chrome Inbox'

    // Drop TZ for date, to string
    var d = new Date().toISOString().slice(0,19)
    
    // Redirect
    console.log(chrome.tabs)
    // window.location.href = `obsidian://vault/${VAULT_NAME}/${CLIPPING_NOTE_NAME}`;

    // Redirect, does this open obsidian?
    // chrome.runtime.getURL()
    // chrome.runtime.sendMessage({"message": "open_new_tab", 'url': });

    
})();