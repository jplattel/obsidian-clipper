// So Much For Subtlety
; (async () => {
    var title = document.title.replace(/\//g, '')
    var url = window.location.href
    var defaultNoteFormat = `> {clip}

// Clipped from [{title}]({url}) at {date}.`

    var defaultClippingOptions = {
        selectAsMarkdown: false,
        obsidianNoteFormat: defaultNoteFormat,
        obsidianNoteName: "Webclip",
        clipAsNewNote: true,
        dateFormat: "YYYY-MM-DD",
        datetimeFormat: "YYYY-MM-DD HH:mm:ss",
        timeFormat: "HH:mm:ss",
    }

    async function getFromStorage(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(key, resolve);
        })
    }

    var clippingOptions = await getFromStorage(defaultClippingOptions)

    var date = moment().format(clippingOptions.dateFormat)
    var datetime = moment().format(clippingOptions.datetimeFormat)

    var time = moment().format(clippingOptions.timeFormat)

    var day = moment().format("DD")
    var month = moment().format("MM")
    var year = moment().format("YYYY")

    var zettel = moment().format("YYYYMMDDHHmmss")
    
    // If select html as markdown
    if (clippingOptions.selectAsMarkdown) {
        // Get the HTML selected
        var sel = rangy.getSelection().toHtml();

        // Turndown to markdown
        var turndown = new TurndownService()

        // This rule constructs url to be absolute URLs for links & images
        var turndownWithAbsoluteURLs = turndown.addRule('baseUrl', {
            filter: ['a', 'img'],
            replacement: function (content, el, options) {
                if (el.nodeName === 'IMG') {
                    var link =  el.getAttributeNode('src').value;
                    var fullLink = new URL(link, url)
                    return `![${content}](${fullLink.href})`
                } else if (el.nodeName === 'A') {
                    var link =  el.getAttributeNode('href').value;
                    var fullLink = new URL(link, url)
                    return `[${content}](${fullLink.href})`
                }
            }
        })

        var selection = turndownWithAbsoluteURLs.turndown(sel)

        // Otherwise plaintext
    } else {
        var selection = window.getSelection()
    }

    // Replace the placeholders: (with regex so multiples are replaced as well..)
    note = clippingOptions.obsidianNoteFormat
    note = note.replace(/{clip}/g, selection)
    note = note.replace(/{date}/g, date)
    note = note.replace(/{datetime}/g, datetime)
    note = note.replace(/{time}/g, time)
    note = note.replace(/{day}/g, day)
    note = note.replace(/{month}/g, month)
    note = note.replace(/{year}/g, year)
    note = note.replace(/{url}/g, url)
    note = note.replace(/{title}/g, title)
    note = note.replace(/{zettel}/g, zettel)

    // replace the placeholder in the title: 
    noteName = clippingOptions.obsidianNoteName
    noteName = noteName.replace(/{clip}/g, selection)
    noteName = noteName.replace(/{date}/g, date)
    noteName = noteName.replace(/{datetime}/g, datetime)
    noteName = noteName.replace(/{time}/g, time)
    noteName = noteName.replace(/{day}/g, day)
    noteName = noteName.replace(/{month}/g, month)
    noteName = noteName.replace(/{year}/g, year)
    noteName = noteName.replace(/{url}/g, url)
    noteName = noteName.replace(/{title}/g, title)
    noteName = noteName.replace(/{zettel}/g, zettel)
    // noteName = noteName.replace(/\//g, '') // Replace / in the name as it's not allowed
    noteName = noteName.replace(/:/g, '') // Replace : in the name as it's not allowed

    // If we clip as a new note, 
    if (clippingOptions.clipAsNewNote) {
        chrome.runtime.sendMessage([noteName, note])
        // If we add to a note, prepare to copy to the clipboard
    } else {
        // Create text-input to copy from:
        var copyFrom = $('<textarea/>');

        // Create text to copy and paste in the textarea
        copyFrom.text(note);
        $('body').append(copyFrom);

        // Select & copy the content
        copyFrom.select();
        document.execCommand('copy');

        // Remove textarea
        copyFrom.remove();
        chrome.runtime.sendMessage([noteName, note])
    }
})();

