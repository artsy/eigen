source 'https://rubygems.org'

gem 'cocoapods'
gem 'cocoapods-keys'
gem 'cocoapods-deintegrate'

# 1.6.7 contains the OS X build fix.
gem 'nokogiri', '1.6.7.rc4'

group :development do
  gem 'houston'
  # Depends on older xcodeproj gem that is incompatible with current CocoaPods.
  #gem 'synx', :git => "https://github.com/orta/synx", :branch => "spaces_to-underscores"
end

group :test do
  gem 'fui'
  gem 'xcpretty'
  gem 'second_curtain'
end

group :distribution do
  gem 'deliver'
  gem 'match'
end
