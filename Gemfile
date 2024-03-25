source 'https://rubygems.org'

ruby ">= 2.6.10"

gem 'fastlane'

# Cocoapods 1.15 introduced a bug which break the build. We will remove the upper
# bound in the template on Cocoapods with next React Native release.
gem 'cocoapods', '>= 1.13', '< 1.15'
gem 'activesupport', '>= 6.1.7.3', '< 7.1.0'

# So we know if we need to run `pod install`
gem 'cocoapods-check'
gem 'cocoapods-patch', '~> 1.3.0'
gem 'down'
gem 'dotenv'
gem 'json'

group :development do
  gem 'lowdown' # For handling notifications + certs
end

group :test do
  gem 'xcode-install' # To ensure we have the right SDK installed for running tests
  gem 'xcpretty' # Makes CI readable
end

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
