#!/usr/bin/env sh
set -e

ARCHIVE=release.tar.gz

go run github.com/tdewolff/minify/v2/cmd/minify@latest \
    -o release/ \
    src/index.html \
    src/stopwatch.js \
    src/style.css
cp LICENSE.txt release/

tar -czf "$ARCHIVE" -C release .

echo "Minified and packed to $ARCHIVE"
