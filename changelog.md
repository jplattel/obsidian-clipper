# Changelog

## 0.5.0

-   Quite a rewrite, reworked the clipping/test functionality so it makes use of the same function.
-   The settings page now opens when a user installs the plugin.
-   Settings are saved before running a test clip (the tab that's used also need to be close manually, to have time for the confirmation dialog about protocol use).
-   If you decide to clip not to clip to a new note, it'll try and open the note with the same name and appending with the content of the clip. 

## 0.4.0

-   Fixed permissions from the Chrome Web Store
-   Moving towards manifest.json V3

## 0.3.6

-   Fixed [not clipping to folders anymore](https://github.com/jplattel/obsidian-clipper/issues/40)
-   Added the link to the [youtube video by Antone](https://www.youtube.com/watch?v=PZnytCMbR-A) to the readme

## 0.3.5

-   Fixed [datetime issue (#32)](https://github.com/jplattel/obsidian-clipper/issues/32).
-   Fixed [better documentation for new note in folder (#33)](https://github.com/jplattel/obsidian-clipper/issues/33)

## 0.3.4

-   You can now use the `{og:image}` placeholder to add an image to the note (This closes [#23](https://github.com/jplattel/obsidian-clipper/issues/23)).

## 0.3.3

-   Release through github actions now works and adds the zip and crx files

## 0.3.2

-   Hopefully configured now!

## 0.3.1 

-   Try to automate releases, not working due to a misconfigured github workflow

## 0.3.0

-   Absolute URLs for links and images!
-   Fixed zettlekasten ID missing zeroes due to date formatting 

## 0.2.6

-   Added more template things (thanks to [@Mearman](https://github.com/Mearman))

## 0.1.3

-   Added a {zettel} placeholder for a zettelkasten id.
-   Allow a user to test the configuration to see if Obsidian opens
-   Added a small icon linking back to my personal page

## 0.1.2

-   Added a ko-fi image and some additional information

## 0.1.1 

-   Updated libraries used and pointing to exact versions of a library for review

## 0.1.0

-   Initial release for Firefox & Chrome.

