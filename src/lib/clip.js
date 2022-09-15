
export const createTest = async () => create(true);

export const create = async (testing=false) => {
    console.log("starting clipper...")
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

    const formatData = makeFormatData(clippingOptions)
    const note = formatNote(clippingOptions.obsidianNoteFormat, formatData)
    const noteName = formatName(clippingOptions.obsidianNoteName, formatData)

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

function makeSelectionData(clippingOptions, testing) {
    let link = '';
    let fullLink = '';

    // If we're testing...
    if (testing) {
        return "This is a test clipping from the Obsidian Clipper"
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
                    link = el.getAttributeNode('src').value;
                    fullLink = new URL(link, url)
                    return `![${content}](${fullLink.href})`
                } else if (el.nodeName === 'A') {
                    link = el.getAttributeNode('href').value;
                    fullLink = new URL(link, url)
                    return `[${content}](${fullLink.href})`
                }
            }
        })

        return turndownWithAbsoluteURLs.turndown(sel)
        // Otherwise plaintext
    } else {
        return window.getSelection()
    }
}

function makeImageData() {
    if (document.querySelector('meta[property="og:image"]')) {
        let image = document.querySelector('meta[property="og:image"]').content
        return `![](${image})` // image only works in the content of the note
    }
    return ""
}

function makeFormatData(clippingOptions) {
    return [
        // regex is used in order to catch duplicates
        {regex: /{title}/g, value: document.title.replace(/\//g, '')},
        {regex: /{url}/g, value: window.location.href},
        {regex: /{clip}/g, value: makeSelectionData(clippingOptions)},
        {regex: /{date}/g, value: moment().format(clippingOptions.dateFormat)},
        {regex: /{time}/g, value: moment().format(clippingOptions.timeFormat)},
        {regex: /{datetime}/g, value: moment().format(clippingOptions.datetimeFormat)},
        {regex: /{day}/g, value: moment().format("DD")},
        {regex: /{month}/g, value: moment().format("MM")},
        {regex: /{year}/g, value: moment().format("YYYY")},
        {regex: /{zettel}/g, value: moment().format("YYYYMMDDHHmmss")},
        {regex: /{og:image}/g, value: makeImageData()},
    ]
}

function applyFormatData(text, formatData) {
    let ret = text

    for (const dat of formatData) {
        ret = ret.replace(dat.regex, dat.value)
    }

    return ret
}

function formatNote(note, formatData) {
    return applyFormatData(note, formatData)
}

function formatName(noteName, formatData) {
    let ret = applyFormatData(noteName, formatData)

    // remove invalid characters: * " \ / < > : | ?
    ret = ret.replace(/[*"\\/<>:|?]/g, " ")
    // valid, but breaks links to the file: # ^ [ ]
    ret = ret.replace(/[#^\[\]]/g, " ")
    return ret
}
