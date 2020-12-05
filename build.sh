#!/bin/bash

# Get the version
VERSION=$(jq -r .version src/manifest.json)
echo "Version: ${VERSION}"


echo "Building for Chrome"

# Zip for deployment
cd src
zip -r ../build/chrome/chrome-obsidian-clipper-${VERSION}.zip .
cd ../

# Build packed extension
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src --pack-extension-key=./key.pem
mv src.crx build/chrome/chrome-obsidian-clipper-${VERSION}.crx

echo "Building for Firefox"

# Web-ext builds for firefox
cd src
web-ext build # Build for firefox
mv web-ext-artifacts/obsidian_clipper-${VERSION}.zip ../build/firefox/firefox-obsidian-clipper-${VERSION}.zip
rm -rf web-ext-artifacts # Remove the build folder
cd ../