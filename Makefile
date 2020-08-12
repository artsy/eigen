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

ECHO_KEY = $(shell dotenv env | grep ARTSY_ECHO_PRODUCTION_TOKEN | awk -F "=" {'print $$2'})

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

oss:
	git submodule update --init
	cp .env.example .env
	cp Artsy/App/Echo.json.example Artsy/App/Echo.json

artsy:
	git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m
	git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+SwiftDeveloperExtras.swift
	cp .env.example .env
	echo "Please update the .env file with the contents from 1Password"

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

promote_if_app_store_submission_branch:
	if [ "$(LOCAL_BRANCH)" == "app_store_submission" ]; then make _promote_beta; fi

_promote_beta: setup_fastlane_env
	bundle exec fastlane update_plugins
	bundle exec fastlane promote_beta

notify_if_new_license_agreement: setup_fastlane_env
	bundle exec fastlane update_plugins
	bundle exec fastlane notify_if_new_license_agreement

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
	curl https://echo-api-production.herokuapp.com/accounts/1 --header "Http-Authorization: $(shell dotenv env | grep ARTSY_ECHO_PRODUCTION_TOKEN | awk -F "=" {'print $$2'})" --header "Accept: application/vnd.echo-v2+json"

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
	# Clear local caches and build files
	@echo 'Clear node modules (┛ಠ_ಠ)┛彡┻━┻'
	rm -rf node_modules
	@echo 'Clear cocoapods directory (ノಠ益ಠ)ノ彡┻━┻'
	rm -rf Pods
	@echo 'Clear Xcode derived data (╯°□°)╯︵ ┻━┻'
	# sometimes this fails on first try even with -rf
	# but a second try takes it home
	if ! rm -rf ~/Library/Developer/Xcode/DerivedData; then rm -rf ~/Library/Developer/Xcode/DerivedData; fi
	@echo 'Clear relay, jest, and metro caches (┛◉Д◉)┛彡┻━┻'
	rm -rf $TMPDIR/RelayFindGraphQLTags-*
	rm -rf .jest
	rm -rf $TMPDIR/metro*
	rm -rf .metro
	@echo 'Clear build artefacts (╯ರ ~ ರ）╯︵ ┻━┻'
	rm -rf emission/Pod/Assets/Emission*
	rm -rf emission/Pod/Assets/assets
	@echo 'Reinstall dependencies ┬─┬ノ( º _ ºノ)'
	bundle exec pod install --repo-update

flip_table_extreme:
  # Clear global and local caches and build files
	@echo 'Clean global yarn & pod caches (┛✧Д✧))┛彡┻━┻'
	yarn cache clean
	bundle exec pod cache clean --all
	make flip_table
