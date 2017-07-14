BREW := $(shell command -v brew 2> /dev/null)
YARN := $(shell command -v yarn 2> /dev/null)
WATCHMAN := $(shell command -v watchman 2> /dev/null)
CODE := $(shell command -v code 2> /dev/null)

oss:
ifndef BREW
    $(error "Please install homebrew before running `make oss`: https://brew.sh")
endif

ifndef YARN
	@echo "Installing Yarn"
	brew install yarn
endif

ifndef WATCHMAN
	@echo "Installing Watchman"
	brew install pcre
	brew link pcre
	brew install watchman --HEAD
endif

ifndef CODE
	@echo "Installing Visual Studio Code"
	brew cask install visual-studio-code
endif

	@echo "Installing Node Dependencies"
	yarn install

	@echo "Installing Cocoa Dependencies"
	cd Example && bundle && bundle exec pod install

	@echo "Installing Hooks for Styling and Compile-checks"
	echo "#!/bin/sh\nyarn run lint-staged\n" > .git/hooks/pre-commit; chmod +x .git/hooks/pre-commit
	echo "#!/bin/sh\nyarn run type-check\n" > .git/hooks/pre-push; chmod +x .git/hooks/pre-push

	@echo "";
	@echo "";
	@echo "That is all of the dependencies for Emission set up, to run the app:";
	@echo "";
	@echo " - Ensure you have an Artsy account: $$(tput setaf 3)https://www.artsy.net/sign_up$$(tput sgr0)"
	@echo " - Open the folder in VS Code: '$$(tput setaf 3)code .$$(tput sgr0)'"
	@echo " - Start the dev server: '$$(tput setaf 3)yarn start$$(tput sgr0)'"
	@echo " - Open Xcode, and run Emission: '$$(tput setaf 3)open Example/Emission.xcworkspace$$(tput sgr0)'"
	@echo ""
	@echo "Any other details can be found in the README."
	@echo "Enjoy!"
	@echo ""
