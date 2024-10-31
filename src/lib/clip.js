
export const createTest = async () => create(true);
export const create = async (testing=false) => {
    console.log("starting clipper...")
    let title = document.title.replace(/\//g, '')
    let url = window.location.href
    let defaultNoteFormat = `> {clip}

// Clipped from [{title}]({url}) at {date}.`

    let defaultClippingOptions = {
        obsidianVaultName: 'Obsidian',
        selectAsMarkdown: false,
        obsidianNoteFormat: defaultNoteFormat,
        obsidianNoteName: "Chrome Clippings",
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

    let clippingOptions = await getFromStorage(defaultClippingOptions)

    let note = clippingOptions.obsidianNoteFormat
    
    let date = moment().format(clippingOptions.dateFormat)
    let datetime = moment().format(clippingOptions.datetimeFormat)
    let time = moment().format(clippingOptions.timeFormat)
    let day = moment().format("DD")
    let month = moment().format("MM")
    let year = moment().format("YYYY")
    let zettel = moment().format("YYYYMMDDHHmmss")
    
    let selection = '';
    let link = '';
    let fullLink = '';
    
    // If we're testing..
    if (testing) {
        selection = "This is a test clipping from the Obsidian Clipper"
    } else if (clippingOptions.selectAsMarkdown) {
        // Get the HTML selected
        let sel = rangy.getSelection().toHtml();

        // Turndown to markdown
        let turndown = new TurndownService()

        // This rule constructs url to be absolute URLs for links & images
        let turndownWithAbsoluteURLs = turndown.addRule('baseUrl', {
            filter: ['a', 'img'],
            replacement: function (content, el, options) {
                if (el.nodeName === 'IMG') {
                    link =  el.getAttributeNode('src').value;
                    fullLink = new URL(link, url)
                    return `![${content}](${fullLink.href})`
                } else if (el.nodeName === 'A') {
                    link =  el.getAttributeNode('href').value;
                    fullLink = new URL(link, url)
                    return `[${content}](${fullLink.href})`
                }
            }
        })

        selection = turndownWithAbsoluteURLs.turndown(sel)
        // Otherwise plaintext
    } else {
        selection = window.getSelection()
    }

    // Replace the placeholders: (with regex so multiples are replaced as well..)
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

    // Clip the og:image if it exists
    if (document.querySelector('meta[property="og:image"]')) {
        let image = document.querySelector('meta[property="og:image"]').content
        note = note.replace(/{og:image}/g, `![](${image})`) // image only works in the content of the note
    } else {
        note = note.replace(/{og:image}/g, "")
    }

    // replace the placeholder in the title, taking into account invalid note names and removing special 
    // chars like \/:#^\[\]|?  that result in no note being created...
    let noteName = clippingOptions.obsidianNoteName
    noteName = noteName.replace(/{date}/g, date.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{day}/g, day.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{month}/g, month.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{year}/g, year.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{url}/g, url.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{title}/g, title.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{zettel}/g, zettel.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{datetime}/g, datetime.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    noteName = noteName.replace(/{time}/g, time.replace(/[*'\/":#^\[\]|?<>]/g, ''))
    
    // Send a clipping messsage
    let data = {
        'testing': testing,
        'noteName': noteName,
        'note': note,
        'vault': clippingOptions.obsidianVaultName,
        'new': clippingOptions.clipAsNewNote
    }
    console.log("sending data...", data)
    chrome.runtime.sendMessage(data)
}


