source 'https://rubygems.org'

gem 'cocoapods', "~> 0.39"
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
  gem 'danger', :git => "https://github.com/danger/danger.git"
end

group :distribution do
  gem 'deliver' # hockey
  gem 'pilot' # itunes connect
  gem 'gym' # building IPAs
  gem 'fastlane' # infrastructre
end
