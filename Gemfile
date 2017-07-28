source 'https://rubygems.org'

gem 'cocoapods', '>= 1.1.0' # Deps
gem 'cocoapods-check' # So we know if we need to run `pod install`
gem 'cocoapods-keys' # So we don't leak ENV vars
gem 'psych' # So our Podfile.lock is consistent

group :development do
  gem 'lowdown' # For handling notifications + certs
end

group :test do
  gem 'danger' # Stop saying 'you forgot to...'
  gem 'nokogiri', '>= 1.6.7' # Lols, just to specify the version
  gem 'second_curtain' # to upload snapshot fails
  gem 'xcpretty' # Makes CI readable
end
