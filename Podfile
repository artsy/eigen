# frozen_string_literal: true

using_bundler = defined? Bundler
unless using_bundler
  puts "\nPlease re-run using:".red
  puts "  yarn pod-install\n\n"
  exit(1)
end


require 'dotenv'
Dotenv.load('.env.shared')


source 'https://github.com/artsy/Specs.git'
source 'https://cdn.cocoapods.org/'


require_relative './node_modules/react-native/scripts/react_native_pods'
require_relative './node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '12.1'
inhibit_all_warnings!

require 'down'
require 'json'
require 'fileutils'


$ReactNativeMapboxGLIOSVersion = '~> 6.4'

def check_for_existing_netrc_file
  if !ENV['MAPBOX_DOWNLOAD_TOKEN']
    raise "You need a MAPBOX_DOWNLOAD_TOKEN in your .env.shared file.\nIf you work at artsy, check 1password.\nOtherwise create your own in the mapbox dashboard. https://docs.mapbox.com/ios/maps/guides/install"
  end
  # mapbox needs credentials in `~/.netrc`, so we put them there and then remove them in post-pod-install.rb
  $netrc_path = File.expand_path('~/.netrc')
  user_already_had_a_netrc_file = File.exists?($netrc_path)
  if user_already_had_a_netrc_file
    system("touch .i-had-a-netrc-file")
  else
    system("rm -rf .i-had-a-netrc-file")
  end
end

def add_mapbox_creds
  File.open($netrc_path, 'a+', 0600) { |f|
    f.write("""machine api.mapbox.com
login mapbox
password #{ENV['MAPBOX_DOWNLOAD_TOKEN']}
""")
  }
end

check_for_existing_netrc_file
add_mapbox_creds


pre_install do |installer|
   $RNMBGL.pre_install(installer)
end

target 'Artsy' do
  config = use_native_modules!
  use_react_native!(
    :path => './node_modules/react-native',
    :production => ENV['CIRCLE_BUILD_NUM'],
  )

  # Networking
  pod 'AFNetworking', '2.7.0', subspecs: %w[Reachability Serialization Security NSURLSession NSURLConnection]
  pod 'AFOAuth1Client', git: 'https://github.com/artsy/AFOAuth1Client.git', tag: '0.4.0-subspec-fix'
  pod 'AFNetworkActivityLogger'
  pod 'SDWebImage', '5.8.3'

  # Core
  pod 'ARGenericTableViewController', git: 'https://github.com/artsy/ARGenericTableViewController.git'
  pod 'CocoaLumberjack', '3.7.2'
  pod 'FLKAutoLayout', git: 'https://github.com/artsy/FLKAutoLayout.git', branch: 'v1'
  pod 'FXBlurView', '1.6.4'
  pod 'ISO8601DateFormatter', git: 'https://github.com/artsy/iso-8601-date-formatter'
  pod 'JLRoutes', git: 'https://github.com/artsy/JLRoutes.git'
  pod 'JSDecoupledAppDelegate'
  pod 'Mantle', '1.5.6'
  pod 'MMMarkdown', '0.4'
  pod 'NPKeyboardLayoutGuide'
  pod 'UICKeyChainStore'
  pod 'MARKRangeSlider'
  pod 'EDColor', '1.0.1'

  # Core owned by Artsy
  pod 'ORStackView', '2.0.3'
  pod 'UIView+BooleanAnimations'
  pod 'Aerodramus', '2.0.0'

  # Language Enhancements
  pod 'MultiDelegate'
  pod 'ObjectiveSugar'

  # Artsy Spec repo stuff
  pod 'Artsy+UIFonts', '3.3.4'
  pod 'Artsy-UIButtons'
  pod 'Artsy+UIColors'
  pod 'Artsy+UILabels'
  pod 'Extraction'

  pod 'Emission', path: './emission', :inhibit_warnings => false

  # For Stripe integration with Emission. Using a fork for this issue: https://github.com/tipsi/tipsi-stripe/issues/408
  pod 'Pulley', git: 'https://github.com/artsy/Pulley.git', branch: 'master'

  # Facebook
  pod 'FBSDKCoreKit', '9.3.0'
  pod 'FBSDKLoginKit', '9.3.0'
  pod 'FBSDKShareKit', '9.3.0'

  # Google & Firebase
  pod 'GoogleSignIn', '5.0.2'
  pod 'Firebase/Auth', '8.1.0'

  # Analytics
  pod 'Segment-Appboy', '4.2.0'
  pod 'Segment-Adjust', '3.1.4'

  # Developer Pods
  pod 'DHCShakeNotifier', '0.2.0'
  pod 'ORKeyboardReactingApplication', '0.5.3'

  # Swift pods 🎉
  pod 'Then', '2.3.0'
  pod 'Interstellar/Core', git: 'https://github.com/artsy/Interstellar.git', branch: 'observable-unsubscribe'
  pod 'Starscream', '3.0.4'
  pod 'SwiftyJSON'

  # Used in Live Auctions to hold user-state
  pod 'JWTDecode'

  target 'Artsy Tests' do
    inherit! :search_paths

    pod 'OHHTTPStubs'
    pod 'XCTest+OHHTTPStubSuiteCleanUp'
    pod 'Specta'
    pod 'Expecta', '1.0.6'
    pod 'Expecta+Snapshots', '3.1.1'
    pod 'OCMock'
    pod 'Forgeries/Mocks'

    # Swift pods 🎉
    pod 'Quick', '2.0.0'
    pod 'Nimble', '7.3.4'
    pod 'Nimble-Snapshots', '6.3.0'
  end
end


# Enables Flipper.
# Note that if you have use_frameworks! enabled, Flipper will not work and
# you should disable these next few lines.
use_flipper!({ 'Flipper-Folly' => '2.5.3', 'Flipper' => '0.87.0', 'Flipper-RSocket' => '1.3.1' })
post_install do |installer|
  flipper_post_install(installer)

  $RNMBGL.post_install(installer)

  # So we can show some of this stuff in the Admin panel
  emission_podspec_json = installer.pod_targets.find { |f| f.name == 'Emission' }.specs[0].to_json
  File.write('Pods/Local Podspecs/Emission.podspec.json', emission_podspec_json)

  # Disable bitcode for now. Specifically needed for HockeySDK and ARAnalytics.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end

  # Forces the minimum to be 9.0 as that's our last deployment target, and new xcode build tools
  # give an error in Xcode 10
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 9.0
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '9.0'
      end
    end
  end

  # CI was having trouble shipping signed builds
  # https://github.com/CocoaPods/CocoaPods/issues/4011
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['EXPANDED_CODE_SIGN_IDENTITY'] = ''
      config.build_settings['CODE_SIGNING_REQUIRED'] = 'NO'
      config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
    end
  end

  # For now Nimble Snapshots needs to stay at Swift 4.0
  swift4 = ['Nimble-Snapshots']
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_VERSION'] = '4.0' if swift4.include?(target.name)
    end
  end

  # Support toggling the RCT_Dev build flag so that we can have it in dev, but not in prod
  react = installer.pods_project.targets.find { |target| target.name == 'React' }
  react.build_configurations.each do |config|
    allow_react_native_debugging = config.name == 'Debug' ? '1' : '0'
    config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = '$(inherited) RCT_DEV=' + allow_react_native_debugging
  end

  # TODO:
  # * ORStackView: Move Laura's changes into master and update
  # * Send PRs for the rest
  %w[
    Pods/ORStackView/Classes/ios/ORStackView.h
  ].flat_map { |x| Dir.glob(x) }.each do |header|
    system("chmod +w #{header}")
    addition = "#import <UIKit/UIKit.h>\n"
    contents = File.read(header)
    next if contents.include?(addition)

    File.open(header, 'w') do |file|
      file.puts addition
      file.puts contents
    end
  end

  # TODO: Might be nice to have a `cocoapods-patch` plugin that applies patches like `patch-package` does for npm.
  %w[
    Pods/Nimble/Sources/NimbleObjectiveC
    Pods/Nimble-Snapshots
    Pods/Quick/Sources/QuickObjectiveC
  ].flat_map { |x| Dir.glob(File.join(x, '**/*.{h,m}')) }.each do |header|
    system("chmod +w #{header}")
    contents = File.read(header)
    patched = contents.sub(%r{["<]\w+/(\w+-Swift\.h)[">]}, '"\1"')
    File.write(header, patched) if Regexp.last_match
  end
end
