// So Much For Subtlety
(function() {
    var d = new Date()
    var date = d.toISOString().slice(0,10)
    var datetime = d.toISOString().slice(0,19)
    var zettel = d.getFullYear().toString() + (d.getMonth()+1).toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString(); 
    var title = document.title
    var url = window.location.href
    var defaultNoteFormat =  `> {clip}

Clipped from [{title}]({url}) at {date}.`
    
    // Get noteFormat from settings
    chrome.storage.sync.get({
        obsidianNoteFormat: defaultNoteFormat,
        selectAsMarkdown: false,
    }, function(options) {

        // See if the noteFormat exists, otherwise use the default
        if (options.obsidianNoteFormat) {
            var noteFormat = options.obsidianNoteFormat

        // Otherwise use the default
        } else {
            var noteFormat = defaultNoteFormat
        }

        // If select html as markdown
        if (options.selectAsMarkdown) {
            // Get the HTML selected
            var sel = rangy.getSelection().toHtml();

            // Turndown to markdown
            var turndownService = new TurndownService()
            var selection = turndownService.turndown(sel)

        // Otherwise plaintext
        } else {
            var selection = window.getSelection()
        }

        // Replace the placeholders: (with regex so multiples are replaced as well..)
        noteFormat = noteFormat.replace(/{clip}/g, selection)
        noteFormat = noteFormat.replace(/{date}/g, date)
        noteFormat = noteFormat.replace(/{datetime}/g, datetime)
        noteFormat = noteFormat.replace(/{url}/g, url)
        noteFormat = noteFormat.replace(/{title}/g, title)
        noteFormat = noteFormat.replace(/{zettel}/g, zettel)

        console.log(noteFormat)

        // Create text-input to copy from:
        var copyFrom = $('<textarea/>');

        // Create text to copy and paste in the textarea
        copyFrom.text(noteFormat);
        $('body').append(copyFrom);

        // Select & copy the content
        copyFrom.select();
        document.execCommand('copy');

        // Remove textarea
        copyFrom.remove();   
    });

})();