
// Saves options to chrome.storage
function saveOptions() {
    var obsidianVaultName = document.getElementById('obsidian_vault_name').value;
    var obsidianNoteName = document.getElementById('obsidian_note_name').value;
    var obsidianNoteFormat = document.getElementById('obsidian_note_format').value;
    var selectAsMarkdown = document.getElementById('select_as_markdown').checked;
    var clipAsNewNote = document.getElementById('clip_as_new_note').checked;
    var datetimeFormat = document.getElementById('datetime_format').value;
    var dateFormat = document.getElementById('date_format').value;
    var timeFormat = document.getElementById('time_format').value;
    var zettelFormat = document.getElementById('zettel_format').value;

    chrome.storage.sync.set({
        obsidianVaultName: obsidianVaultName,
        obsidianNoteName: obsidianNoteName,
        selectAsMarkdown, selectAsMarkdown,
        obsidianNoteFormat, obsidianNoteFormat,
        clipAsNewNote: clipAsNewNote,
        datetimeFormat: datetimeFormat,
        dateFormat: dateFormat,
        timeFormat: timeFormat,
        zettelFormat: zettelFormat,
        
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
function restoreOptions() {
    chrome.storage.sync.get({
        obsidianVaultName: 'obsidian',
        obsidianNoteName: 'Chrome Clippings',
        selectAsMarkdown: false,
        obsidianNoteFormat: `> {clip},

Clipped from [{title}]({url}) at {date}.`,
        clipAsNewNote: true,
        datetimeFormat: "YYYY-MM-DD HH:mm:ss",
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm:ss",
        zettelFormat: "YYYYMMDDHHmmss",
    }, function(options) {
        document.getElementById('obsidian_vault_name').value = options.obsidianVaultName;
        document.getElementById('obsidian_note_name').value = options.obsidianNoteName;
        document.getElementById('obsidian_note_format').value = options.obsidianNoteFormat;
        document.getElementById('select_as_markdown').checked = options.selectAsMarkdown;
        document.getElementById('clip_as_new_note').checked = options.clipAsNewNote;
        document.getElementById('datetime_format').value = options.datetimeFormat;
        document.getElementById('date_format').value = options.dateFormat;
        document.getElementById('time_format').value = options.timeFormat;
        document.getElementById('zettel_format').value = options.zettelFormat;
    });
}

function resetFormat() {
    document.getElementById('obsidian_note_format').value = `> {clip}
Clipped from [{title}]({url}) at {date}.`
}

async function testClipping() {
    // Save settings first
    saveOptions();

    // Run the clipper
    const clipper = await import(chrome.runtime.getURL('lib/clip.js'));
    await clipper.createTest()
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetFormat);
document.getElementById('test').addEventListener('click', testClipping);
