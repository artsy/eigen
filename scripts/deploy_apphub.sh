# See: https://github.com/joshuapinter/apphubdeploy
#

# Set up our npm environment again
npm install
npm install --global apphubdeploy

# Create a .apphub credentials file
echo "{\"appHubId\":\"Z6IwqK52JBXrKLI4kpvJ\",\"appHubSecret\":\"$APP_HUB_SECRET\"}" > .apphub

# Get the most recent PR commit
SHA=`git rev-list --min-parents=2 --max-count=1 HEAD`
# Pull the name of the PR out of the auto-generated commit description
PR_DESC=`git log --format=%B -n 1 $SHA | tail -1`
# Get the PR number out of the merge commit title
PR_NUM=`git log --format=%B -n 1 $SHA | grep -Eo '#[0-9]+' | tail -n 1`

# Ship a debug build of our current RN
apphubdeploy --plist-file ./Example/Emission/Info.plist --target all --build-description "$PR_DESC - ${PR_NUM}"

# To avoid build failures, kill the node_modules folder
# e.g. https://travis-ci.org/artsy/emission/builds/158175879
rm -rf node_modules
