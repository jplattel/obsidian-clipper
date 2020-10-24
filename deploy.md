
# Chrome packaging:

1.  Increase version number in manifest.json
2.  Package the extension with: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src --pack-extension-key=./key.pem`
3.  Run `mv src.crx build/chrome/obsidian-clipper.crx`
