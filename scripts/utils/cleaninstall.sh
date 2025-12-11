#!/bin/bash

### Script to clean install everything in order to ensure a fresh environment after
### merging the react native new architecture changes


echo "🧹 🧽 🧼 🧹"


echo "Clearing android specific caches"

rm -rf ~/.gradle/caches
rm -rf ~/.gradle/daemon

rm -rf .gradle
rm -rf build
rm -rf app/build

echo 'Clear node modules (┛ಠ_ಠ)┛彡┻━┻'
rm -rf node_modules

echo "Clear caches (linting and metro) (┛◉Д◉)┛彡┻━┻"
rm -rf .cache
rm -rf "$TMPDIR/metro*"

echo "Clear hastemap (╯ರ ~ ರ）╯︵ ┻━┻"
rm -rf "$TMPDIR/haste-map-*"

echo "Clear CocoaPods cache (ノಠ益ಠ)ノ彡┻━┻"
rm -rf ~/Library/Caches/CocoaPods

echo 'Clear Xcode derived data (╯°□°)╯︵ ┻━┻'
# sometimes this fails on first try even with -rf
# but a second try takes it home
if ! rm -rf ~/Library/Developer/Xcode/DerivedData; then
	rm -rf ~/Library/Developer/Xcode/DerivedData
fi

echo "Clear Gems (┛ಠ_ಠ)┛彡┻━┻"
rm -rf .vendor

echo "Clear Yarn cache (ノಠ益ಠ)ノ彡┻━┻"
yarn cache clean

echo '✅ Clean complete!'

echo '📥 Starting fresh install...'

yarn

echo '🎨 Setting up Artsy environment'

yarn setup:artsy

echo '📥 Installing all dependencies'

yarn install:all

echo 'Explicit installation of react native reanimated and worklets to avoid any type of weirdness'

yarn add react-native-reanimated@4.1.5 react-native-worklets@0.6.1


echo "💫🫧 Everything is squishy clean 💫🫧"