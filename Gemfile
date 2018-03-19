source 'https://rubygems.org'

gem 'cocoapods', git: 'https://github.com/CocoaPods/CocoaPods.git'
gem 'cocoapods-core', git: 'https://github.com/CocoaPods/Core.git'

gem 'cocoapods-check' # So we know if we need to run `pod install`
gem 'cocoapods-keys' # So we don't leak ENV vars
gem 'psych' # So our Podfile.lock is consistent

group :development do
  gem 'lowdown' # For handling notifications + certs
end

group :test do
  gem 'danger' # Stop saying 'you forgot to...'
  gem 'xcode-install' # To ensure we have the right SDK installed for running tests
  gem 'nokogiri', '>= 1.6.7' # Lols, just to specify the version
  gem 'second_curtain' # to upload snapshot fails
  gem 'xcpretty' # Makes CI readable
end
