#!/bin/bash


# Clear pods and cache
pushd ios;
rm -rf Pods/  
bundle exec pod cache clean --all
popd;

# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# maybe should also clear node_modules :(
# maybe have chosen the wrong career

# run the app
npx expo run:ios --no-build-cache
