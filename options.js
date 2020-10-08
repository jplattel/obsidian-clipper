console.log('js loaded')

// Saves options to chrome.storage
function save_options() {
    var obsidianVaultName = document.getElementById('obsidian_vault_name').value;
    var obsidianNoteName = document.getElementById('obsidian_note_name').value;
    chrome.storage.sync.set({
        obsidianVaultName: obsidianVaultName,
        obsidianNoteName: obsidianNoteName
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        obsidianVaultName: 'obsidian',
        obsidianNoteName: 'Chrome Clippings',
    }, function(options) {
        document.getElementById('obsidian_vault_name').value = options.obsidianVaultName;
        document.getElementById('obsidian_note_name').value = options.obsidianNoteName;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);