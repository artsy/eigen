# Set storybook environment depending on STORYBOOK env variable
./scripts/set-storybook-environment.js

# if the user has the React Native Debugger app installed, then use that
# otherwise, at time of writing, it opens chrome

if [ -d '/Applications/React Native Debugger.app' ]
then
  export REACT_DEBUGGER="open 'rndebugger://set-debugger-loc?host=localhost&port=8081' --args"
fi
node node_modules/react-native/local-cli/cli.js start
