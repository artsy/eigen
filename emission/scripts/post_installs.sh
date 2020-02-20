# Comes from https://github.com/artsy/emission/pull/778
touch tmp.file
awk '/returned javascript/ {f=15} f && f-- {$0="//"$0}1' node_modules/react-native/React/Base/RCTJavaScriptLoader.mm > tmp.file
mv tmp.file node_modules/react-native/React/Base/RCTJavaScriptLoader.mm
