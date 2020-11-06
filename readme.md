# Obsidian Chrome Clipper

## Screencast

![Screencast](docs/demo.gif)

This is an unofficial Chrome Extension to quickly clip a selection on a webpage to Obsidian.

## Installing (Chrome)

Since this extension is not yet published, a manual install is required. For this you will need to do the following:

1.  Download/clone this repository
2.  Navigate to the [Chrome Extension](chrome://extensions) and enabled developer mode (top right of your window)
3.  Unzip the extension at the `build/chrome` folder. Or straight from the source with the `src` folder.
3.  Load unpacked extension and navigate to the folder you just unzipped or `src` of this repository you just downloaded or cloned.
4.  Chrome will now build the extension and you can use the extension menu to pin in to the user interface.
5.  You're now ready to configure the extension, see the steps below in Usage & Settings:

## Installing (Firefox)

1.  Download/clone this repository
2.  Allow unsigned extensions, see [https://www.thewindowsclub.com/allow-unsigned-extensions-installed-firefox](https://www.thewindowsclub.com/allow-unsigned-extensions-installed-firefox).
3.  Navigate to the [Chrome Addons](about:addons) 
4.  Add the zipfile from `build/firefox` through the cog menu.
5.  You're now ready to configure the extension, see the steps below in Usage & Settings:

This extenion is only tested on Chrome/Firefox on OS X. I've heard people got it working on Unix with the flatpak Obsidian app. 

## Usage & Settings

1.  Right-click on the extension icon in the menu, and click on options.
2.  A webpage should open where you can configure the options for this extension
3.  You can configure the following:
    -   `vault`: Allows you to specify which vault to open
    -   `note`: The name of the note you want to append to
4.  You can specify the clipping template using placeholders like `{clip}` and `{date}`.
5.  Decide if you want a markdown clip (HTML is converted to markdown and added to your clipboard) or plain text.

Once configured, you're now good to go, using it only takes two steps:

1.  Make a selection on a page and click the icon of the extension _(or use a shortcut key!)_.
2.  Obsidian will try to open the specific note within the vault you specified, you can then paste your clipping!


## Building further upon this extension

Since Chrome allows you to set a custom shortcut to activate an extenion it should be pretty easy to chain it together with Keyboard Meastro or any other automation technology to both clip & paste the results.

## Roadmap

-   ~~Support Firefox~~
-   ~~Allow a user to create a clipping template~~
-   ~~Markdown clipping with [Turndown](https://github.com/domchristie/turndown)~~
-   Make a option that let's you prepend a Zettelkasten id to the clipping itself? (through the template perhaps?)
-   Once the url-scheme of Obsidian allows the creation of a new note, clip to a new note.
-   In the long term future, maybe even offer the possiblity to search through your notes and append it?
-   If you have any ideas, please create an issue with the `feature` label on it, thanks! 😁

## Technical explanation

This clipper is made possible with a work-around, since Chrome Extensions are forbidden to open custom url-schemes directly. The way around this issue is a custom html page that is hosted on Github-pages and also included in the repository: `docs/clip.html`. This little file contains javascript that pulls the data like vault & note out of the url params. With this data, it reconstructs the obsidian url and opens the right note!

## Support

Want to support me? You can do so via Ko-Fi: 

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/R6R62KRKX)