
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

    const formatData = getFormatData(clippingOptions)
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

function getFormatData(clippingOptions) {
    const selectionData = makeSelectionData(clippingOptions)
    const imageData = makeImageData()

    return {
        title: document.title.replace(/\//g, ''),
        url: window.location.href,
        selection: selectionData,
        date: moment().format(clippingOptions.dateFormat),
        datetime: moment().format(clippingOptions.datetimeFormat),
        time: moment().format(clippingOptions.timeFormat),
        day: moment().format("DD"),
        month: moment().format("MM"),
        year: moment().format("YYYY"),
        zettel: moment().format("YYYYMMDDHHmmss"),
        image: imageData
    }
}

function formatNote(note, formatData) {
    let ret = note
    // use regex to catch duplicates
    ret = ret.replace(/{clip}/g, formatData.selection)
    ret = ret.replace(/{url}/g, formatData.url)
    ret = ret.replace(/{title}/g, formatData.title)
    ret = ret.replace(/{date}/g, formatData.date)
    ret = ret.replace(/{time}/g, formatData.time)
    ret = ret.replace(/{datetime}/g, formatData.datetime)
    ret = ret.replace(/{day}/g, formatData.day)
    ret = ret.replace(/{month}/g, formatData.month)
    ret = ret.replace(/{year}/g, formatData.year)
    ret = ret.replace(/{zettel}/g, formatData.zettel)
    ret = ret.replace(/{og:image}/g, formatData.image)
    return ret
}

function formatName(noteName, formatData) {
    let ret = noteName
    // use regex to catch duplicates
    ret = ret.replace(/{url}/g, formatData.url)
    ret = ret.replace(/{title}/g, formatData.title)
    ret = ret.replace(/{date}/g, formatData.date)
    ret = ret.replace(/{time}/g, formatData.time)
    ret = ret.replace(/{datetime}/g, formatData.datetime)
    ret = ret.replace(/{day}/g, formatData.day)
    ret = ret.replace(/{month}/g, formatData.month)
    ret = ret.replace(/{year}/g, formatData.year)
    ret = ret.replace(/{zettel}/g, formatData.zettel)

    // remove invalid characters: * " \ / < > : | ?
    ret = ret.replace(/[*"\\/<>:|?]/g, " ")
    // valid, but breaks links to the file: # ^ [ ]
    ret = ret.replace(/[#^\[\]]/g, "")
    return ret
}
