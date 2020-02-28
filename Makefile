WORKSPACE = Artsy.xcworkspace
SCHEME = Artsy
SCHEME_INTEGRATION_TESTS = 'Artsy Integration Tests'
CONFIGURATION = Beta
APP_PLIST = Artsy/App_Resources/Artsy-Info.plist
STICKER_PLIST = Artsy\ Stickers/Info.plist
PLIST_BUDDY = /usr/libexec/PlistBuddy
DEVICE_HOST = platform='iOS Simulator',OS='12.4',name='iPhone X'
# Disable warnings as errors for now, because we’re currently not getting the same errors during dev as deploy.
# OTHER_CFLAGS = OTHER_CFLAGS="\$$(inherited) -Werror"


GIT_COMMIT_REV = $(shell git log -n1 --format='%h')
GIT_COMMIT_SHA = $(shell git log -n1 --format='%H')
GIT_REMOTE_ORIGIN_URL = $(shell git config --get remote.origin.url)

DATE_MONTH = $(shell date "+%e %h" | tr "[:lower:]" "[:upper:]")
DATE_VERSION = $(shell date "+%Y.%m.%d.%H")

CHANGELOG = CHANGELOG.md

LOCAL_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
BRANCH = $(shell echo host=github.com | git credential fill | sed -E 'N; s/.*username=(.+)\n?.*/\1/')-$(shell git rev-parse --abbrev-ref HEAD)

## Allows us to determine how long it takes to compile a
SWIFT_BUILD_FLAGS = OTHER_SWIFT_FLAGS="-Xfrontend -debug-time-function-bodies"
## Lets us use circle caching for build artifacts
DERIVED_DATA = -derivedDataPath derived_data
RESULT_BUNDLE = -resultBundlePath derived_data/result_bundle

.PHONY: all build ci test oss pr artsy

all: ci

### Aliases

appstore: update_bundle_version
next: update_bundle_version

### General setup

# The ArtsyAPIClientKey and ArtsyAPIClientSecret are provided for open source
# contributors to learn from the app. Please don't abuse the keys or we'll
# need to rotate them and you'll make it harder for everyone to learn.
#
# As these are publicly available, they are not eligable for the Artsy Bug
# Bounty program.
oss:
	git submodule update --init
	bundle exec pod repo update
	bundle exec pod keys set "ArtsyAPIClientSecret" "3a33d2085cbd1176153f99781bbce7c6" Artsy
	bundle exec pod keys set "ArtsyAPIClientKey" "e750db60ac506978fc70"
	bundle exec pod keys set "ArtsyFacebookAppID" "-"
	bundle exec pod keys set "SegmentProductionWriteKey" "-"
	bundle exec pod keys set "SegmentDevWriteKey" "-"
	bundle exec pod keys set "AdjustProductionAppToken" "-"
	bundle exec pod keys set "ArtsyEchoProductionToken" "-"
	bundle exec pod keys set "SentryProductionDSN" "-"
	bundle exec pod keys set "SentryStagingDSN" "-"
	cp Artsy/App/Echo.json.example Artsy/App/Echo.json

artsy:
	git submodule update --init
	git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m
	git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+SwiftDeveloperExtras.swift

certs:
	echo "Don't log in with it@artsymail.com, use your account on our Artsy team."
	bundle exec match appstore

distribute: change_version_to_date set_git_properties setup_fastlane_env
	brew update
	brew install getsentry/tools/sentry-cli
	bundle exec fastlane update_plugins
	bundle exec fastlane ship_beta

setup_fastlane_env:
	rm -f Gemfile.lock Gemfile
	cp fastlane/Gemfile .
	bundle install

### General Xcode tooling

build:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration '$(CONFIGURATION)' -sdk iphonesimulator build -destination $(DEVICE_HOST) $(SWIFT_BUILD_FLAGS) $(DERIVED_DATA) | tee ./xcode_build_raw.log | bundle exec xcpretty -c

build-for-tests:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration Debug -sdk iphonesimulator build -destination $(DEVICE_HOST) $(SWIFT_BUILD_FLAGS) $(DERIVED_DATA) | tee ./xcode_build_raw.log | bundle exec xcpretty -c

test:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration Debug test -sdk iphonesimulator -destination $(DEVICE_HOST) $(DERIVED_DATA) $(OTHER_CFLAGS) | bundle exec second_curtain 2>&1 | tee ./xcode_test_raw.log  | bundle exec xcpretty -c --test --report junit --output ./test-results.xml

# This is currently not being called from our CI yaml file [!]
uitest:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME_INTEGRATION_TESTS) -configuration Debug test -sdk iphonesimulator -destination $(DEVICE_HOST) $(DERIVED_DATA) $(RESULT_BUNDLE) | bundle exec second_curtain 2>&1 | tee $,./xcode_uitest_raw.log  | bundle exec xcpretty -c --test --report junit --output ./xcode-results.xml

### CI

ci:
	if [ "$(LOCAL_BRANCH)" != "beta" ] && [ "$(LOCAL_BRANCH)" != "app_store_submission" ]; then make build-for-tests; else echo "Skipping test build on beta deploy."; fi

ci-test:
	if [ "$(LOCAL_BRANCH)" != "beta" ] && [ "$(LOCAL_BRANCH)" != "app_store_submission" ]; then make test; else echo "Skipping test run on beta deploy."; fi

deploy_if_beta_branch:
	if [ "$(LOCAL_BRANCH)" == "beta" ]; then make distribute; fi

deploy:
	git push origin "$(LOCAL_BRANCH):beta" -f

### App Store Submission

promote_beta_to_submission:
	git push origin "$(LOCAL_BRANCH):app_store_submission" -f
	# Make sure there's a non-master branch to push
	if [ "$(LOCAL_BRANCH)" == "master" ]; then git checkout -b "deploy_$(GIT_COMMIT_SHA)"; fi
	echo 'Pushing changes so you can PR them back to master'
	git push -u origin "$(LOCAL_BRANCH):$(BRANCH)" -f
	open "https://github.com/artsy/eigen/pull/new/artsy:master...$(BRANCH)"

promote_if_app_store_submission_branch:
	if [ "$(LOCAL_BRANCH)" == "app_store_submission" ]; then make promote_beta; fi

promote_beta: setup_fastlane_env
	bundle exec fastlane update_plugins
	bundle exec fastlane promote_beta

### Utility functions

update_bundle_version:
	@printf 'What is the new human-readable release version? '; \
		read HUMAN_VERSION; \
		$(PLIST_BUDDY) -c "Set CFBundleShortVersionString $$HUMAN_VERSION" $(APP_PLIST); \
		$(PLIST_BUDDY) -c "Set CFBundleShortVersionString $$HUMAN_VERSION" $(STICKER_PLIST)

stamp_date:
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --text "$(DATE_MONTH)"

change_version_to_date:
	$(PLIST_BUDDY) -c "Set CFBundleVersion $(DATE_VERSION)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set CFBundleVersion $(DATE_VERSION)" $(STICKER_PLIST)

set_git_properties:
	$(PLIST_BUDDY) -c "Set GITCommitRev $(GIT_COMMIT_REV)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set GITCommitSha $(GIT_COMMIT_SHA)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set GITRemoteOriginURL $(GIT_REMOTE_ORIGIN_URL)" $(APP_PLIST)

update_echo:
	# Circle has trouble accessing CocoaPods keys from the command link. ArtsyEchoProductionToken is an ENV var on CI, so reference it directly if it's non-zero length.
	curl https://echo-api-production.herokuapp.com/accounts/1 --header "Http-Authorization: $(shell [[ -z "${ArtsyEchoProductionToken}" ]] && bundle exec pod keys get ArtsyEchoProductionToken Artsy || echo ${ArtsyEchoProductionToken})" --header "Accept: application/vnd.echo-v2+json" > Artsy/App/Echo.json

storyboards:
	swiftgen storyboards Artsy --output Artsy/Tooling/Generated/StoryboardConstants.swift
	swiftgen images Artsy --output Artsy/Tooling/Generated/StoryboardImages.swift

### Useful commands

synxify:
	bundle exec synx --spaces-to-underscores -e "/Documentation" Artsy.xcodeproj

pr:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not PRing"; else git push -u origin "$(LOCAL_BRANCH):$(BRANCH)"; open "https://github.com/artsy/eigen/pull/new/artsy:master...$(BRANCH)"; fi

push:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not pushing"; else git push origin $(LOCAL_BRANCH):$(BRANCH); fi

fpush:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not pushing"; else git push origin $(LOCAL_BRANCH):$(BRANCH) --force; fi

flip_table:
	# Clear caches and build files
	@echo 'Clear yarn cache and node modules (┛ಠ_ಠ)┛彡┻━┻'
	yarn cache clean
	rm -rf node_modules
	@echo 'Clear cocoapods directory and caches  (ノಠ益ಠ)ノ彡┻━┻'
	bundle exec pod cache clean --all
	rm -rf Pods
	@echo 'Clear Xcode derived data (╯°□°)╯︵ ┻━┻'
	rm -rf ~/Library/Developer/Xcode/DerivedData/*