
export const createTest = async () => create(true);

export const create = async (testing=false) => {
    console.log("starting clipper...")
    let defaultNoteFormat = `> {clip}

// Clipped from [{title}]({url}) at {date}.`

    let defaultClippingOptions = { // todo: make defaults come from options.js
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

function convertToMarkdown(htmlText) {
    let turndown = new TurndownService()

    let url = window.location.href
    let link, fullLink

    // replace relative URLs with absolute URLs
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

    return turndownWithAbsoluteURLs.turndown(htmlText)
}

function makeSelectionData(clippingOptions) {
    if (clippingOptions.selectAsMarkdown) {
        let sel = rangy.getSelection().toHtml()
        return convertToMarkdown(sel).trim()
    } else {
        return window.getSelection().toString().trim()
    }
}

function makeImageData() {
    if (document.querySelector('meta[property="og:image"]')) {
        let image = document.querySelector('meta[property="og:image"]').content
        return `![](${image})` // image only works in the content of the note
    }
    return ""
}

function formatBlockQuote(text) {
    // trim whitespace from line start/end
    // insert > at start of every line, including the first
    return "> " + text.replace(/ *\n */g, "\n> ")
}

function getTimezoneData() {
    // timezone offset returns negative of what should be displayed
    const timezoneOffset = -(new Date().getTimezoneOffset() / 60)

    return "UTC" + (timezoneOffset >= 0 ? "+" : "") + timezoneOffset.toString()
}

function makeFormatData(clippingOptions) {
    const sel = makeSelectionData(clippingOptions)
    return [
        // regex is used in order to catch duplicates
        {regex: /{title}/g, value: document.title.replace(/\//g, '')},
        {regex: /{url}/g, value: window.location.href},
        {regex: /{clip}/g, value: sel},
        {regex: /{blockquote}/g, value: formatBlockQuote(sel)},
        {regex: /{date}/g, value: moment().format(clippingOptions.dateFormat)},
        {regex: /{time}/g, value: moment().format(clippingOptions.timeFormat)},
        {regex: /{datetime}/g, value: moment().format(clippingOptions.datetimeFormat)},
        {regex: /{timezone}/g, value: getTimezoneData()},
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
    // because folders are accessed via slashes,
    // they need to be removed from placeholders but
    // not from the noteName formatting string
    // todo: backslashes seem to cause a new file to always be created. haven't tested it much.
    const noParentheses = formatData.map((item) => {
            return {
                regex: item.regex,
                value: item.value.replace(/\\[/]/g, " ")
            }
        })

    let ret = applyFormatData(noteName, noParentheses)

    // remove invalid characters: * " \ / < > : | ?
    // but actually don't remove \ / because they're used for folders
    ret = ret.replace(/[*"<>:|?]/g, " ")
    // valid, but breaks links to the file: # ^ [ ]
    ret = ret.replace(/[#^\[\]]/g, " ")
    return ret
}
