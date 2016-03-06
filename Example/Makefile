ROOT = $(shell pwd)

server:
	cd node_modules/react-native; npm run start -- --root "$(ROOT)/Emission"

bootstrap:
	brew install node flow
	brew install pcre
	brew link pcre
	brew install --HEAD watchman
