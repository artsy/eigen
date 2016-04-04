source 'https://rubygems.org'

# This resolves to either b7 or rc1
gem 'cocoapods', git: "https://github.com/cocoapods/cocoapods", branch: "mr-fix-resource-bundles"
gem 'cocoapods-keys'

# 1.6.7 contains the OS X build fix.
gem 'nokogiri', '1.6.7.rc4'


group :development do
  gem 'lowdown'
  # Depends on older xcodeproj gem that is incompatible with current CocoaPods.
  #gem 'synx', :git => "https://github.com/orta/synx", :branch => "spaces_to-underscores"
end

group :test do
  gem 'xcpretty'
  gem 'second_curtain'
  gem 'danger'
end

group :distribution do
  gem 'deliver' # hockey
  gem 'pilot' # itunes connect
  gem 'gym' # building IPAs
  gem 'fastlane' # infrastructre
end
