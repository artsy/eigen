
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
