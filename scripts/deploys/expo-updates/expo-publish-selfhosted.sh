#!/bin/bash

# This is the publish script for self-hosted expo updates.

RELEASECHANNEL=$1
PROJECTPATH=$2
UPLOADKEY=$3
APISERVER=$4

showUsage () {
  printf "Usage: expo-publish-selfhosted.sh <release-channel> <expo-project-folder> <upload-key> <api-server> \n"
  printf "Example: expo-publish-selfhosted.sh staging ~/expo/myproject abc123def456 http://localhost:3000 \n"
}

###############################################################################
# Check that all the required parameters are present.
###############################################################################

# Checking Release Channel
if [ -z "$RELEASECHANNEL" ]; then
      printf "Error: missing release channel parameter.\n"
      showUsage
      exit 1
fi

# Checking Project Path
if [ -z "$PROJECTPATH" ]; then
      printf "Error: missing project folder directoryrelease channel parameter.\n"
      showUsage
      exit 1
fi

# Checking Upload Key
if [ -z "$UPLOADKEY" ]; then
      printf "Error: missing upload key parameter.\n"
      showUsage
      exit 1
fi

# Checking API Server
if [ -z "$APISERVER" ]; then
      printf "Error: missing API Server parameter.\n"
      showUsage
      exit 1
fi


# Checking project path
cd $PROJECTPATH
if [ ! -f "app.json" ]; then
  printf "Error: app.json not found in $(pwd)"
  exit 1
fi

###############################################################################
# Publish the update
###############################################################################

# Getting project slug for project name
SLUG=$(grep -o '"slug": "[^"]*' app.json | grep -o '[^"]*$')
RUNTIMEVERSION=$(grep -o '"runtimeVersion": "[^"]*' app.json | grep -o '[^"]*$')

BUILDFOLDER=/tmp/$SLUG-$RUNTIMEVERSION-$RELEASECHANNEL
PAYLOAD="\"$BUILDFOLDER.zip\""

# Idempotent cleanup

rm -rf $BUILDFOLDER
rm -f $BUILDFOLDER.zip
mkdir $BUILDFOLDER

# Build update
yarn expo export --output-dir $BUILDFOLDER --dump-sourcemap

# Add app.json & package.json to the build for info & Metadata
cp app.json $BUILDFOLDER/
cp package.json $BUILDFOLDER/

# Compress update
cd $BUILDFOLDER
zip -q $BUILDFOLDER.zip -r ./*
cd -

# Upload update
curl --location --request POST "$APISERVER/upload" \
--form "uri=@$PAYLOAD" \
--header "project: $SLUG" \
--header "version: $RUNTIMEVERSION" \
--header "release-channel: $RELEASECHANNEL" \
--header "upload-key: $UPLOADKEY"  \
--header "git-branch: $(git rev-parse --abbrev-ref HEAD)" \
--header "git-commit: $(git log --oneline -n 1)"

# Cleanup
# we keep the build folder around to enable sourcemap upload
# rm -rf $BUILDFOLDER
rm -f $BUILDFOLDER.zip

printf "\n\nPublish Done\n\n"

echo "BUILDFOLDER_PATH=$BUILDFOLDER"
