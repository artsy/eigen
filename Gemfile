source 'https://rubygems.org'

ruby ">= 2.6.10"

# Exclude problematic versions of activesupport that causes build failures.
gem 'cocoapods', '1.16.2'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
gem 'xcodeproj'


# concurrent-ruby >= 1.3.5 no longer requires 'logger', and activesupport 6.1.x
# references Logger without requiring it, so `bundle exec pod` crashes with
# "uninitialized constant ActiveSupport::LoggerThreadSafeLevel::Logger". A bare
# `gem 'logger'` is not enough because bundler does not auto-require Gemfile gems;
# require it here so it is loaded before cocoapods loads active_support.
require 'logger'
gem 'concurrent-ruby', '>= 1.3.7'

# So we know if we need to run `pod install`
gem 'cocoapods-check'
gem 'cocoapods-patch', '~> 1.3.0'
gem 'down'
gem 'dotenv'
gem 'json'

# Ruby 3.4.0 has removed some libraries from the standard library.
gem 'bigdecimal'
gem 'logger'
gem 'benchmark'
gem 'mutex_m'

group :development do
  gem 'lowdown' # For handling notifications + certs
end

group :test do
  gem 'xcode-install' # To ensure we have the right SDK installed for running tests
  gem 'xcpretty' # Makes CI readable
end

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
