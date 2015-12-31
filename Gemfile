source 'https://rubygems.org'

gem 'cocoapods', :git => "https://github.com/CocoaPods/CocoaPods.git", :branch => "seg-podfile-refactor"
gem 'cocoapods-core', :git => "https://github.com/CocoaPods/Core.git", :branch => "seg-podfile-refactor"
gem 'xcodeproj', :git => "https://github.com/CocoaPods/Xcodeproj.git"

gem 'cocoapods-keys'
gem 'cocoapods-deintegrate', :git => "https://github.com/CocoaPods/cocoapods-deintegrate.git"

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
  gem 'pilot'
  gem 'gym'
end
