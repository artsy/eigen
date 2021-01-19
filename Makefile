WORKSPACE = Artsy.xcworkspace
SCHEME = Artsy
SCHEME_INTEGRATION_TESTS = 'Artsy Integration Tests'
CONFIGURATION = Beta
DEVICE_HOST = platform='iOS Simulator',OS='14.2',name='iPhone 12 Pro'
# Disable warnings as errors for now, because we’re currently not getting the same errors during dev as deploy.
# OTHER_CFLAGS = OTHER_CFLAGS="\$$(inherited) -Werror"

DATE_MONTH = $(shell date "+%e %h" | tr "[:lower:]" "[:upper:]")

BRANCH = $(shell echo host=github.com | git credential fill | sed -E 'N; s/.*username=(.+)\n?.*/\1/')-$(shell git rev-parse --abbrev-ref HEAD)

## Lets us use circle caching for build artifacts
DERIVED_DATA = -derivedDataPath derived_data
RESULT_BUNDLE = -resultBundlePath derived_data/result_bundle

### General setup

oss:
	touch .env.ci
	cp .env.example .env.shared

artsy:
	touch .env.ci
	aws s3 cp s3://artsy-citadel/dev/.env.eigen .env.shared

certs:
	@echo "Don't log in with it@artsymail.com, use your account on our Artsy team."
	bundle exec match appstore

### General Xcode tooling

build:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration '$(CONFIGURATION)' -sdk iphonesimulator build -destination $(DEVICE_HOST) $(DERIVED_DATA) | tee ./xcode_build_raw.log | bundle exec xcpretty -c

build-for-tests-ios:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration Debug -sdk iphonesimulator build -destination $(DEVICE_HOST) $(DERIVED_DATA) | tee ./xcode_build_raw.log | bundle exec xcpretty -c

build-for-tests-android:
	npx jetifier
	cd android; ./gradlew buildRelease; cd -

test-ios:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration Debug test -sdk iphonesimulator -destination $(DEVICE_HOST) $(DERIVED_DATA) $(OTHER_CFLAGS) | bundle exec second_curtain 2>&1 | tee ./xcode_test_raw.log  | bundle exec xcpretty -c --test --report junit --output ./test-results.xml

test-android:
	# cd android; ./gradlew test; cd -
	# For now, we don't have any native tests, let's just return 0.
	exit 0

# This is currently not being called from our CI yaml file [!]
uitest:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME_INTEGRATION_TESTS) -configuration Debug test -sdk iphonesimulator -destination $(DEVICE_HOST) $(DERIVED_DATA) $(RESULT_BUNDLE) | bundle exec second_curtain 2>&1 | tee $,./xcode_uitest_raw.log  | bundle exec xcpretty -c --test --report junit --output ./xcode-results.xml

### CI

ci-ios:
	if [ "${LOCAL_BRANCH}" != "beta-ios" ] && [ "${LOCAL_BRANCH}" != "app_store_submission" ]; then make build-for-tests-ios; else echo "Skipping test build on beta deploy."; fi

ci-android:
	if [ "${LOCAL_BRANCH}" != "beta-android" ] && [ "${LOCAL_BRANCH}" != "app_store_submission" ]; then make build-for-tests-android; else echo "Skipping test build on beta deploy."; fi

ci-test-ios:
	if [ "${LOCAL_BRANCH}" != "beta-ios" ] && [ "${LOCAL_BRANCH}" != "app_store_submission" ]; then make test-ios; else echo "Skipping test run on beta deploy."; fi

ci-test-android:
	if [ "${LOCAL_BRANCH}" != "beta-android" ] && [ "${LOCAL_BRANCH}" != "app_store_submission" ]; then make test-android; else echo "Skipping test run on beta deploy."; fi

### App Store Submission

promote_beta_to_submission:
	git push origin "${LOCAL_BRANCH}:app_store_submission" -f --no-verify

promote_if_app_store_submission_branch:
	if [ "${LOCAL_BRANCH}" == "app_store_submission" ]; then make _promote_beta; fi

_promote_beta: setup_fastlane_env
	bundle exec fastlane update_plugins
	bundle exec fastlane promote_beta

notify_if_new_license_agreement: setup_fastlane_env
	bundle exec fastlane update_plugins
	bundle exec fastlane notify_if_new_license_agreement

### Utility functions

stamp_date:
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --text "$(DATE_MONTH)"

storyboards:
	swiftgen storyboards Artsy --output Artsy/Tooling/Generated/StoryboardConstants.swift
	swiftgen images Artsy --output Artsy/Tooling/Generated/StoryboardImages.swift

### Useful commands

pr:
	if [ "${LOCAL_BRANCH}" == "master" ]; then echo "In master, not PRing"; else git push -u origin "${LOCAL_BRANCH}:$(BRANCH)"; open "https://github.com/artsy/eigen/pull/new/artsy:master...$(BRANCH)"; fi

push:
	if [ "${LOCAL_BRANCH}" == "master" ]; then echo "In master, not pushing"; else git push origin ${LOCAL_BRANCH}:$(BRANCH); fi

fpush:
	if [ "${LOCAL_BRANCH}" == "master" ]; then echo "In master, not pushing"; else git push origin ${LOCAL_BRANCH}:$(BRANCH) --force --no-verify; fi
