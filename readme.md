# Obsidian Chrome Clipper

This is an unofficial Chrome Extension to quickly clip a selection on a webpage to Obsidian.

## Installing

Since this extension is not yet published, a manual install is required. For this you will need to do the following:

1.  Download/clone this repository
2.  Navigate to the [Chrome Extension](chrome://extensions) and enabled developer mode (top right of your window)
3.  Load unpacked extension and navigate to the folder of this repository you just downloaded or cloned.
4.  Chrome will now build the extension and you can use the extension menu to pin in to the user interface.
5.  You're now ready to configure the extension, see the steps below:

## Usage & Settings

1.  Right-click on the extension icon in the menu, and click on options.
2.  A webpage should open where you can configure the options for this extension
3.  You can configure the following:
    -   `vault`: Allows you to specify which vault to open
    -   `note`: The name of the note you want to append to

Once configured, you're now good to go, using it only takes two steps:

1.  Make a selection on a page and click the icon of the extension _(or use a shortcut key!)_.
2.  Obsidian will try to open the specific note within the vault you specified, you can then paste your clipping!

## Building further upon this extension

Since Chrome allows you to set a custom shortcut to activate an extenion it should be pretty easy to chain it together with Keyboard Meastro or any other automation technology to both clip & paste the results.

## Roadmap

-   Make a option that let's you prepend a Zettelkasten id to the clipping itself?
-   Once the url-scheme of Obsidian allows the creation of a new note, clip to a new note.
-   In the long term future, maybe even offer the possiblity to search through your notes and append it?
-   If you have any ideas, please create an issue with the `feature` label on it, thanks! 😁

## Technical explanation

This clipper is made possible with a work-around, since Chrome Extensions are forbidden to open custom url-schemes directly. The way around this issue is a custom html page that is hosted on Github-pages and also included in the repository: `docs/clip.html`. This little file contains javascript that pulls the data like vault & note out of the url params. With this data, it reconstructs the obsidian url and opens the right note!