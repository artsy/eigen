# See: https://github.com/joshuapinter/apphubdeploy
# Create a .apphub credentials file
echo "{\"appHubId\":\"Z6IwqK52JBXrKLI4kpvJ\",\"appHubSecret\":\"$APP_HUB_SECRET\"}" > .apphub

# while this PR is active: https://github.com/joshuapinter/apphubdeploy/pull/5
npm install --global orta/apphubdeploy

# Ship a debug build of our current RN
apphubdeploy --plist-file ./Example/Emission/Info.plist --target debug