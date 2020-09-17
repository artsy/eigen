# frozen_string_literal: true

using_bundler = defined? Bundler
unless using_bundler
  puts "\nPlease re-run using:".red
  puts "  bundle exec pod install\n\n"
  exit(1)
end

source 'https://github.com/artsy/Specs.git'
source 'https://cdn.cocoapods.org/'

platform :ios, '12.0'
inhibit_all_warnings!

require 'down'
require 'json'
require 'fileutils'

# We need to scope the side-effects of downloading Emission's NPM podspecs to
# only cases where we are actually installing pods.
installing_pods = ARGV.include?('install') || ARGV.include?('update')

system 'yarn install --ignore-engines' if installing_pods

target 'Artsy' do
  # Networking
  pod 'AFNetworking', '~> 2.5', subspecs: ['Reachability', 'Serialization', 'Security', 'NSURLSession', 'NSURLConnection']
  pod 'AFOAuth1Client', git: 'https://github.com/artsy/AFOAuth1Client.git', tag: '0.4.0-subspec-fix'
  pod 'AFNetworkActivityLogger'
  pod 'SDWebImage', '>= 3.7.2' # 3.7.2 contains a fix that allows you to not force decoding each image, which uses lots of memory

  # Core
  pod 'ARGenericTableViewController', git: 'https://github.com/orta/ARGenericTableViewController.git'
  pod 'CocoaLumberjack', git: 'https://github.com/CocoaLumberjack/CocoaLumberjack.git' # Unreleased > 2.0.1 version has a CP modulemap fix
  pod 'FLKAutoLayout', git: 'https://github.com/orta/FLKAutoLayout.git', branch: 'v1'
  pod 'FXBlurView'
  pod 'ISO8601DateFormatter', git: 'https://github.com/orta/iso-8601-date-formatter'
  pod 'JLRoutes', git: 'https://github.com/orta/JLRoutes.git'
  pod 'JSDecoupledAppDelegate'
  pod 'Mantle', '~> 1.5.6'
  pod 'MMMarkdown'
  pod 'NPKeyboardLayoutGuide'
  pod 'UICKeyChainStore'
  pod 'MARKRangeSlider'
  pod 'EDColor'
  pod 'SSFadingScrollView', git: 'https://github.com/alloy/SSFadingScrollView.git', branch: 'add-axial-support'

  # Core owned by Artsy
  pod 'ORStackView', '2.0.3'
  pod 'UIView+BooleanAnimations'
  pod 'Aerodramus'

  # Custom CollectionView Layouts
  pod 'ARCollectionViewMasonryLayout', git: 'https://github.com/ashfurrow/ARCollectionViewMasonryLayout'

  # Language Enhancements
  pod 'KSDeferred'
  pod 'MultiDelegate'
  pod 'ObjectiveSugar'

  # Artsy Spec repo stuff
  pod 'Artsy+UIFonts'
  pod 'Artsy-UIButtons'
  pod 'Artsy+UIColors'
  pod 'Artsy+UILabels'
  pod 'Extraction'

  pod 'Emission', path: './emission'

  pod 'React', path: 'node_modules/react-native'
  if ENV['CIRCLE_BUILD_NUM']
    pod 'React-Core', path: 'node_modules/react-native'
  else
    pod 'React-Core', path: 'node_modules/react-native', subspecs: ['DevSupport']
  end
  pod 'React-CoreModules', path: 'node_modules/react-native/React/CoreModules'
  pod 'React-RCTActionSheet', path: 'node_modules/react-native/Libraries/ActionSheetIOS'
  pod 'React-RCTAnimation', path: 'node_modules/react-native/Libraries/NativeAnimation'
  pod 'React-RCTImage', path: 'node_modules/react-native/Libraries/Image'
  pod 'React-RCTLinking', path: 'node_modules/react-native/Libraries/LinkingIOS'
  pod 'React-RCTText', path: 'node_modules/react-native/Libraries/Text'
  pod 'React-RCTNetwork', path: 'node_modules/react-native/Libraries/Network'
  pod 'React-RCTSettings', path: 'node_modules/react-native/Libraries/Settings'
  pod 'React-RCTBlob', path: 'node_modules/react-native/Libraries/Blob'
  pod 'React-RCTVibration', path: 'node_modules/react-native/Libraries/Vibration'
  pod 'FBLazyVector', path: 'node_modules/react-native/Libraries/FBLazyVector'
  pod 'FBReactNativeSpec', path: 'node_modules/react-native/Libraries/FBReactNativeSpec'
  pod 'RCTRequired', path: 'node_modules/react-native/Libraries/RCTRequired'
  pod 'RCTTypeSafety', path: 'node_modules/react-native/Libraries/TypeSafety'
  pod 'ReactCommon/turbomodule/core', path: 'node_modules/react-native/ReactCommon'
  pod 'ReactCommon/callinvoker', path: 'node_modules/react-native/ReactCommon'
  pod 'React-cxxreact', path: 'node_modules/react-native/ReactCommon/cxxreact'
  pod 'React-jsi', path: 'node_modules/react-native/ReactCommon/jsi'
  pod 'React-jsiexecutor', path: 'node_modules/react-native/ReactCommon/jsiexecutor'
  pod 'React-jsinspector', path: 'node_modules/react-native/ReactCommon/jsinspector'
  pod 'Yoga', path: 'node_modules/react-native/ReactCommon/yoga', modular_headers: true
  pod 'Folly', podspec: 'node_modules/react-native/third-party-podspecs/Folly.podspec'
  pod 'DoubleConversion', podspec: 'node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
  pod 'glog', podspec: 'node_modules/react-native/third-party-podspecs/glog.podspec'
  pod 'RNSentry', path: 'node_modules/@sentry/react-native'
  pod 'Sentry', path: 'node_modules/@sentry/react-native/ios/Sentry'
  pod 'tipsi-stripe', podspec: 'node_modules/tipsi-stripe/tipsi-stripe.podspec'
  pod 'react-native-mapbox-gl', path: 'node_modules/@mapbox/react-native-mapbox-gl'
  pod 'RNSVG', path: 'node_modules/react-native-svg'
  pod 'react-native-cameraroll', path: 'node_modules/@react-native-community/cameraroll'
  pod 'react-native-netinfo', path: 'node_modules/@react-native-community/netinfo'
  pod 'react-native-geolocation', path: 'node_modules/@react-native-community/geolocation'
  pod 'react-native-safe-area-context', path: 'node_modules/react-native-safe-area-context'
  pod 'react-native-navigator-ios', path: 'node_modules/react-native-navigator-ios'
  pod 'RNReanimated', path: 'node_modules/react-native-reanimated'
  pod 'RNCAsyncStorage', path: 'node_modules/@react-native-community/async-storage'
  pod 'RNCPicker', path: 'node_modules/@react-native-community/picker'
  pod 'BVLinearGradient', path: './node_modules/react-native-linear-gradient'
  pod 'RNImageCropPicker', path: './node_modules/react-native-image-crop-picker/RNImageCropPicker.podspec'
  # TODO: Remove the `.podspec` files from these paths
  pod 'react-native-config', path: 'node_modules/react-native-config'
  pod 'react-native-webview', :path => 'node_modules/react-native-webview'

  # For Stripe integration with Emission. Using Ash's fork for this issue: https://github.com/tipsi/tipsi-stripe/issues/408
  pod 'Pulley', git: 'https://github.com/l2succes/Pulley.git', branch: 'master'

  # Facebook
  pod 'FBSDKCoreKit', '~> 7.1.1'
  pod 'FBSDKLoginKit', '~> 7.1.1'

  # Analytics
  pod 'Analytics'
  pod 'ARAnalytics', subspecs: %w[Segmentio]
  pod 'SailthruMobile'

  # Developer Pods
  pod 'DHCShakeNotifier'
  pod 'ORKeyboardReactingApplication'

  # Swift pods 🎉
  pod 'Then'
  pod 'Interstellar/Core', git: 'https://github.com/ashfurrow/Interstellar.git', branch: 'observable-unsubscribe'
  pod 'Starscream'
  pod 'SwiftyJSON'

  # Used in Live Auctions to hold user-state
  pod 'JWTDecode'

  target 'Artsy Tests' do
    inherit! :search_paths

    pod 'FBSnapshotTestCase'
    pod 'Expecta+Snapshots'
    pod 'OHHTTPStubs'
    pod 'XCTest+OHHTTPStubSuiteCleanUp'
    pod 'Specta'
    pod 'Expecta'
    pod 'OCMock'
    pod 'Forgeries/Mocks'

    # Swift pods 🎉
    pod 'Quick'
    pod 'Nimble'
    pod 'Nimble-Snapshots'
  end
end

post_install do |installer|
  # So we can show some of this stuff in the Admin panel
  emission_podspec_json = installer.pod_targets.find { |f| f.name == 'Emission' }.specs[0].to_json
  File.write('Pods/Local Podspecs/Emission.podspec.json', emission_podspec_json)

  # Note: we don't want Echo.json checked in, so Artsy staff download it at pod install time. We
  # use a stubbed copy for OSS developers.
  echo_key = `dotenv -f ".env.shared,.env.ci env" | grep ARTSY_ECHO_PRODUCTION_TOKEN | awk -F "=" {'print $2'}`
  if echo_key.length > 1 # OSS contributors have "-" as their key
    puts 'Updating Echo...'
    `make update_echo &> /dev/null`
  end

  # Disable bitcode for now. Specifically needed for HockeySDK and ARAnalytics.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end

  # Forces the minimum to be 9.0 as that's our last deployment targer, and new xcode build tools
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
    Pods/ARAnalytics/ARAnalytics.h
    Pods/ARTiledImageView/Classes/ARTiledImageViewDataSource.h
    Pods/DRKonamiCode/Sources/DRKonamiGestureRecognizer.h
    Pods/NAMapKit/NAMapKit/*.h
  ].flat_map { |x| Dir.glob(x) }.each do |header|
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
    contents = File.read(header)
    patched = contents.sub(%r{["<]\w+/(\w+-Swift\.h)[">]}, '"\1"')
    File.write(header, patched) if Regexp.last_match
  end
end
