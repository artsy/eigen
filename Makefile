WORKSPACE = Artsy.xcworkspace
SCHEME = Artsy
CONFIGURATION = Beta
APP_PLIST = Artsy/App_Resources/Artsy-Info.plist
PLIST_BUDDY = /usr/libexec/PlistBuddy
TARGETED_DEVICE_FAMILY = \"1,2\"
DEVICE_HOST = platform='iOS Simulator',OS='8.4',name='iPhone 6'

GIT_COMMIT_REV = $(shell git log -n1 --format='%h')
GIT_COMMIT_SHA = $(shell git log -n1 --format='%H')
GIT_REMOTE_ORIGIN_URL = $(shell git config --get remote.origin.url)

DATE_MONTH = $(shell date "+%e %h" | tr "[:lower:]" "[:upper:]")
DATE_VERSION = $(shell date "+%Y.%m.%d")

CHANGELOG = CHANGELOG.md
CHANGELOG_SHORT = CHANGELOG_SHORT.md

IPA = Artsy.ipa
DSYM = Artsy.app.dSYM.zip

CIRCLE_TEST_REPORTS ?= $(TMPDIR)

.PHONY: all build ci clean test lint oss pr artsy

all: ci

build:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration '$(CONFIGURATION)' -sdk iphonesimulator build | tee $(CIRCLE_ARTIFACTS)/xcode_build_raw.log | bundle exec xcpretty -c

clean:
	xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration '$(CONFIGURATION)' clean

test:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration Debug build test -sdk iphonesimulator -destination $(DEVICE_HOST) | bundle exec second_curtain | tee $(CIRCLE_ARTIFACTS)/xcode_test_raw.log  | bundle exec xcpretty -c --test --report junit --output $(CIRCLE_TEST_REPORTS)/xcode/results.xml

lint:
	bundle exec fui --path Artsy find

oss:
	bundle exec pod keys set "ArtsyAPIClientSecret" "3a33d2085cbd1176153f99781bbce7c6" Artsy
	bundle exec pod keys set "ArtsyAPIClientKey" "e750db60ac506978fc70"
	bundle exec pod keys set "ArtsyFacebookAppID" "-"
	bundle exec pod keys set "ArtsyTwitterKey" "-"
	bundle exec pod keys set "ArtsyTwitterSecret" "-"
	bundle exec pod keys set "ArtsyTwitterStagingKey" "-"
	bundle exec pod keys set "ArtsyTwitterStagingSecret" "-"
	bundle exec pod keys set "SegmentProductionWriteKey" "-"
	bundle exec pod keys set "SegmentDevWriteKey" "-"
	bundle exec pod keys set "AdjustProductionAppToken" "-"

artsy:
	git submodule init
	git submodule update
	config/spacecommander/setup-repo.sh

ci: CONFIGURATION = Debug
ci: build

update_bundle_version:
	@printf 'What is the new human-readable release version? '; \
		read HUMAN_VERSION; \
		$(PLIST_BUDDY) -c "Set CFBundleShortVersionString $$HUMAN_VERSION" $(APP_PLIST)

format-objc-files-in-repo.sh.bundler:
	gem install bundler
	bundle install

ipa: set_git_properties change_version_to_date
	$(PLIST_BUDDY) -c "Set CFBundleDisplayName $(BUNDLE_NAME)" $(APP_PLIST)
	ipa build --scheme $(SCHEME) --configuration $(CONFIGURATION) -t --verbose

stamp_date:
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --text "$(DATE_MONTH)"

change_version_to_date:
	$(PLIST_BUDDY) -c "Set CFBundleVersion $(DATE_VERSION)" $(APP_PLIST)

set_git_properties:
	$(PLIST_BUDDY) -c "Set GITCommitRev $(GIT_COMMIT_REV)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set GITCommitSha $(GIT_COMMIT_SHA)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set GITRemoteOriginURL $(GIT_REMOTE_ORIGIN_URL)" $(APP_PLIST)

set_targeted_device_family:
	perl -pi -w -e "s{TARGETED_DEVICE_FAMILY = \"?[1,2]+\"?;}{TARGETED_DEVICE_FAMILY = $(TARGETED_DEVICE_FAMILY);}g" Artsy.xcodeproj/project.pbxproj

distribute:
	./config/generate_changelog_short.rb
	curl \
	 -F repository_url=$(GIT_REMOTE_ORIGIN_URL) \
	 -F commit_sha=$(GIT_COMMIT_SHA) \
	 -F status=2 \
	 -F notify=$(NOTIFY) \
	 -F "notes=<$(CHANGELOG_SHORT)" \
	 -F notes_type=1 \
	 -F ipa=@$(IPA) \
	 -F dsym=@$(DSYM) \
	 -H 'X-HockeyAppToken: $(HOCKEYAPP_TOKEN)' \
	 https://rink.hockeyapp.net/api/2/apps/upload \
	 | grep -v "errors"

appstore: update_bundle_version set_git_properties change_version_to_date set_targeted_device_family

appledemo: NOTIFY = 0
appledemo: CONFIGURATION = "Apple Demo"
appledemo: set_git_properties change_version_to_date set_targeted_device_family
appledemo: ipa distribute

next: update_bundle_version set_git_properties change_version_to_date set_targeted_device_family

deploy: ipa distribute

alpha: BUNDLE_NAME = 'Artsy α'
alpha: NOTIFY = 0
alpha: stamp_date deploy

beta: BUNDLE_NAME = 'Artsy β'
beta: NOTIFY = 1
beta: deploy

synxify: 
	bundle exec synx --spaces-to-underscores -e "/Documentation" Artsy.xcodeproj

LOCAL_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
BRANCH = $(shell echo $(shell whoami)-$(shell git rev-parse --abbrev-ref HEAD))

pr:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not PRing"; else git push upstream "$(LOCAL_BRANCH):$(BRANCH)"; open -a "Google Chrome" "https://github.com/artsy/eigen/pull/new/artsy:master...$(BRANCH)"; fi

push:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not pushing"; else git push upstream $(LOCAL_BRANCH):$(BRANCH); fi

fpush:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not pushing"; else git push upstream $(LOCAL_BRANCH):$(BRANCH) --force; fi
