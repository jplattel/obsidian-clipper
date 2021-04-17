
// Saves options to chrome.storage
function save_options() {
    var obsidianVaultName = document.getElementById('obsidian_vault_name').value;
    var obsidianNoteName = document.getElementById('obsidian_note_name').value;
    var obsidianNoteFormat = document.getElementById('obsidian_note_format').value;
    var selectAsMarkdown = document.getElementById('select_as_markdown').checked;
    var clipAsNewNote = document.getElementById('clip_as_new_note').checked;
    var dateFormat = document.getElementById('date_format').value;
    var datetimeFormat = document.getElementById('datetime_format').value;

    chrome.storage.sync.set({
        obsidianVaultName: obsidianVaultName,
        obsidianNoteName: obsidianNoteName,
        selectAsMarkdown, selectAsMarkdown,
        obsidianNoteFormat, obsidianNoteFormat,
        clipAsNewNote: clipAsNewNote,
        dateFormat: dateFormat,
        datetimeFormat: datetimeFormat,
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
        selectAsMarkdown: false,
        obsidianNoteFormat: `> {clip},

Clipped from [{title}]({url}) at {date}.`,
        clipAsNewNote: true,
        dateFormat: "YYYY-MM-DD",
        datetimeFormat: "YYYY-MM-DD HH:mm:ss",
    }, function(options) {
        document.getElementById('obsidian_vault_name').value = options.obsidianVaultName;
        document.getElementById('obsidian_note_name').value = options.obsidianNoteName;
        document.getElementById('obsidian_note_format').value = options.obsidianNoteFormat;
        document.getElementById('select_as_markdown').checked = options.selectAsMarkdown;
        document.getElementById('clip_as_new_note').checked = options.clipAsNewNote;
        document.getElementById('date_format').value = options.dateFormat;
        document.getElementById('datetime_format').value = options.datetimeFormat;
    });
}

function reset_format() {
    document.getElementById('obsidian_note_format').value = `> {clip}
Clipped from [{title}]({url}) at {date}.`
}

function test_clipping() {
    chrome.storage.sync.get({
        obsidianVaultName: 'obsidian',
        obsidianNoteName: 'Chrome Clip: {title}',
        selectAsMarkdown: false,
        obsidianNoteFormat: `> {clip}

Clipped from [{title}]({url}) at {date}.`,
        clipAsNewNote: true,
        dateFormat: "YYYY-MM-DD",
        datetimeFormat: "YYYY-MM-DD HH:mm:ss",
    }, function(options) {

        // Replace with real data
        var d = new Date()
        var date = moment().format(options.dateFormat)
        var datetime = moment().format(options.datetimeFormat)
        var zettel = d.getFullYear().toString() + (d.getMonth()+1).toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString(); 
        var url = 'https://jplattel.github.io/obsidian-clipper/'
        var title = "Obsidian Clipper"
        var note = options.obsidianNoteFormat
        var noteName = options.obsidianNoteName

        // Replace the placeholders: (with regex so multiples are replaced as well..)
        note = note.replace(/{clip}/g, "This is an example clip")
        note = note.replace(/{date}/g, date)
        note = note.replace(/{datetime}/g, datetime)
        note = note.replace(/{url}/g, url)
        note = note.replace(/{title}/g, title)
        note = note.replace(/{zettel}/g, zettel)

        // Replace the placeholders: (with regex so multiples are replaced as well..)
        noteName = noteName.replace(/{date}/g, date)
        noteName = noteName.replace(/{datetime}/g, datetime)
        noteName = noteName.replace(/{url}/g, url)
        noteName = noteName.replace(/{title}/g, title)
        noteName = noteName.replace(/{zettel}/g, zettel)    

        if (options.clipAsNewNote) {
            note = note.replace(/\n/g, '%0A') // Encode the new line character
            redirectUrl = `https://jplattel.github.io/obsidian-clipper/clip-to-new.html?vault=${options.obsidianVaultName}&note=${noteName}&content=${encodeURIComponent(note)}`            
        } else {
            // Get the clipping format
            var clipFormat = document.getElementById('obsidian_note_format').value
            
            // Create text to copy and paste in the textarea so we can select it for copying
            document.getElementById('obsidian_note_format').value = note
            document.getElementById('obsidian_note_format').select()
            document.execCommand('copy')

            // Reset to the clipping format
            document.getElementById('obsidian_note_format').value = clipFormat
            
            // Open redirect to open the specified note in Obsidian
            redirectUrl = `https://jplattel.github.io/obsidian-clipper/clip.html?vault=${options.obsidianVaultName}&note=${noteName}`
        }
        chrome.tabs.create({ url: redirectUrl , active: true});    
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset_format').addEventListener('click', reset_format);
document.getElementById('test').addEventListener('click', test_clipping);