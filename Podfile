using_bundler = defined? Bundler
unless using_bundler
  puts "\nPlease re-run using:".red
  puts "  bundle exec pod install\n\n"
  exit(1)
end

source 'https://github.com/artsy/Specs.git'
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '8.0'
inhibit_all_warnings!
plugin 'cocoapods-fix-react-native'

# Note: These should be reflected _accurately_ in the environment of
#       the continuous build server.

plugin 'cocoapods-keys', {
  :project => "Artsy",
  :target => "Artsy",
  :keys => [
    "ArtsyAPIClientSecret",      # Authing to the Artsy API
    "ArtsyAPIClientKey",         #
    "ArtsyFacebookAppID",        # Supporting FB Login
    "SegmentProductionWriteKey", # Analytics
    "SegmentDevWriteKey",        #
    "AdjustProductionAppToken",  # Marketing
    "ArtsyEchoProductionToken",  # Runtime behavior changes
    "SentryProductionDSN",       # Crash Logging
    "SentryStagingDSN",          #
    "StripeProductionPublishableKey", # Necessary for Stripe integration
    "StripeStagingPublishableKey",
    "GoogleMapsAPIKey",          # Consignment Location Lookup
  ]
}

target 'Artsy' do

  # Networking
  pod 'AFNetworking', "~> 2.5"
  pod 'AFOAuth1Client', :git => "https://github.com/lxcid/AFOAuth1Client.git", :tag => "0.4.0"
  pod 'AFNetworkActivityLogger'
  pod 'SDWebImage', '>= 3.7.2' # 3.7.2 contains a fix that allows you to not force decoding each image, which uses lots of memory

  # Core
  pod 'ARGenericTableViewController', :git => 'https://github.com/orta/ARGenericTableViewController.git'
  pod 'CocoaLumberjack', :git => 'https://github.com/CocoaLumberjack/CocoaLumberjack.git' # Unreleased > 2.0.1 version has a CP modulemap fix
  pod 'FLKAutoLayout', :git => 'https://github.com/orta/FLKAutoLayout.git', :branch => 'v1'
  pod 'FXBlurView'
  pod 'iRate'
  pod 'ISO8601DateFormatter', :git => "https://github.com/orta/iso-8601-date-formatter"
  pod 'JLRoutes', :git => 'https://github.com/orta/JLRoutes.git'
  pod 'JSDecoupledAppDelegate'
  pod 'Mantle', '~> 1.5.6'
  pod 'MMMarkdown'
  pod 'NPKeyboardLayoutGuide'
  pod 'ReactiveObjC'
  pod 'UICKeyChainStore'
  pod 'MARKRangeSlider'
  pod 'EDColor'
  pod 'SSFadingScrollView', :git => 'https://github.com/alloy/SSFadingScrollView.git', :branch => 'add-axial-support'
  # For Stripe integration with Emission
  pod 'tipsi-stripe', :git => "https://github.com/tipsi/tipsi-stripe.git"

  # Core owned by Artsy
  pod 'ARTiledImageView', :git => 'https://github.com/dblock/ARTiledImageView'
  pod 'ORStackView', '2.0.3'
  pod 'UIView+BooleanAnimations'
  pod 'NAMapKit', :git => 'https://github.com/neilang/NAMapKit'
  pod 'Aerodramus'

  # Custom CollectionView Layouts
  pod 'ARCollectionViewMasonryLayout', :git => 'https://github.com/ashfurrow/ARCollectionViewMasonryLayout'

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

  pod 'Emission', '~> 1.6.0'
  pod 'yoga', :podspec => "https://raw.githubusercontent.com/artsy/emission/v1.5.2/externals/yoga/yoga.podspec.json"
  pod 'React/Core'

  # Facebook
  pod 'FBSDKCoreKit', '~> 4.33'
  pod 'FBSDKLoginKit', '~> 4.33'

  # Analytics
  pod 'Analytics'
  pod 'ARAnalytics', :subspecs => ["Segmentio", "Adjust", "DSL"]

  # Developer Pods
  pod 'DHCShakeNotifier'
  pod 'ORKeyboardReactingApplication'
  pod 'VCRURLConnection'

  # Swift pods 🎉
  pod 'Then'
  pod 'Interstellar/Core', git: 'https://github.com/ashfurrow/Interstellar.git', branch: 'observable-unsubscribe'
  pod 'Starscream'
  pod 'SwiftyJSON'

  # Used in Live Auctions to hold user-state
  pod 'JWTDecode'

  pod 'Sentry'

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

def edit_pod_file(file, old_code, new_code)
  code = File.read(file)
  if code.include?(old_code)
    FileUtils.chmod("+w", file)
    File.write(file, code.sub(old_code, new_code))
  end
end

post_install do |installer|
  # Disable bitcode for now. Specifically needed for HockeySDK and ARAnalytics.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end

  # CI was having trouble shipping signed builds
  # https://github.com/CocoaPods/CocoaPods/issues/4011
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['EXPANDED_CODE_SIGN_IDENTITY'] = ""
      config.build_settings['CODE_SIGNING_REQUIRED'] = "NO"
      config.build_settings['CODE_SIGNING_ALLOWED'] = "NO"
    end
  end

  react = installer.pods_project.targets.find { |target| target.name == 'React' }
  react.build_configurations.each do |config|
    config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = "$(inherited) RCT_DEV=0"
  end

  # TODO:
  # * ORStackView: Move Laura's changes into master and update
  # * Send PRs for the rest
  %w(
    Pods/ORStackView/Classes/ios/ORStackView.h
    Pods/ARAnalytics/ARAnalytics.h
    Pods/ARTiledImageView/Classes/ARTiledImageViewDataSource.h
    Pods/DRKonamiCode/Sources/DRKonamiGestureRecognizer.h
    Pods/NAMapKit/NAMapKit/*.h
  ).flat_map { |x| Dir.glob(x) }.each do |header|
    addition = "#import <UIKit/UIKit.h>\n"
    contents = File.read(header)
    unless contents.include?(addition)
      File.open(header, "w") do |file|
        file.puts addition
        file.puts contents
      end
    end
  end

  # TODO: Might be nice to have a `cocoapods-patch` plugin that applies patches like `patch-package` does for npm.
  %w(
    Pods/Nimble/Sources/NimbleObjectiveC
    Pods/Nimble-Snapshots
    Pods/Quick/Sources/QuickObjectiveC
  ).flat_map { |x| Dir.glob(File.join(x, "**/*.{h,m}")) }.each do |header|
    contents = File.read(header)
    patched = contents.sub(/["<]\w+\/(\w+-Swift\.h)[">]/, '"\1"')
    File.write(header, patched) if Regexp.last_match
  end
end
