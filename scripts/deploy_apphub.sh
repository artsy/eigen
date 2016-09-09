# See: https://github.com/joshuapinter/apphubdeploy
#

# Set up our npm environment again
npm install
npm install --global apphubdeploy

# Create a .apphub credentials file
echo "{\"appHubId\":\"Z6IwqK52JBXrKLI4kpvJ\",\"appHubSecret\":\"$APP_HUB_SECRET\"}" > .apphub

# Ship a debug build of our current RN
apphubdeploy --plist-file ./Example/Emission/Info.plist --target all

# To avoid build failures, kill the node_modules folder
# e.g. https://travis-ci.org/artsy/emission/builds/158175879
rm -rf node_modules