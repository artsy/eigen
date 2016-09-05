# See: https://github.com/joshuapinter/apphubdeploy
#
# Create a .apphub credentials file
echo "{\"appHubId\":\"Z6IwqK52JBXrKLI4kpvJ\",\"appHubSecret\":\"$APP_HUB_SECRET\"}" > .apphub

npm install --global apphubdeploy

# Ship a debug build of our current RN
apphubdeploy --plist-file ./Example/Emission/Info.plist --target debug