.PHONY: oss artsy

# Setup

oss:
	./scripts/setup-env-for-oss

artsy:
	./scripts/setup-env-for-oss


# Deploy betas

deploy:
	./scripts/deploy-both

deploy_ios:
	./scripts/deploy-ios

deploy_android:
	./scripts/deploy-android


# Misc

next:
	./scripts/next

update_echo:
	./scripts/update-echo


# FLIP! DAT! TABLE!

# Clear local caches and build files
flip_table:
	./scripts/flip-table

# Clear global and local caches and build files
flip_table_extreme:
	./scripts/flip-table-extreme
