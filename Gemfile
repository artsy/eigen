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
  #gem 'deliver'
  gem 'fastlane_core', :git => 'https://github.com/alloy/fastlane_core.git', :branch => 'update-simplified-chinese-language-code'
  gem 'deliver', :git => 'https://github.com/alloy/deliver.git', :branch => 'only-include-known-languages'
end
