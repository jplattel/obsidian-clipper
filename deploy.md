
# General release

1.  Increase version number in manifest.json
2.  Test in Chrome & Firefox
3.  `cd src` and Run both things below for each browser:
4.  Deploy to Gihub: `git push origin master`

# Chrome packaging:

1.  Package the extension with: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src --pack-extension-key=./key.pem`
2.  Run `mv src.crx build/chrome/obsidian-clipper.crx`

# Firefox:

1.  Package the extions with: `web-ext build` 
2.  Run `mv web-ext-artifacts ../build/firefox`