source 'https://github.com/artsy/Specs.git'
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '8.0'
use_frameworks!

install! 'cocoapods', :deterministic_uuids => false

# Yep.
inhibit_all_warnings!

# Allows per-dev overrides
local_podfile = "Podfile.local"
eval(File.read(local_podfile)) if File.exist? local_podfile

plugin 'cocoapods-keys', {
    :project => "Artsy",
    :target => "Artsy",
    :keys => [
        "ArtsyAPIClientSecret",
        "ArtsyAPIClientKey",
        "ArtsyFacebookAppID",
        "ArtsyTwitterKey",
        "ArtsyTwitterSecret",
        "ArtsyTwitterStagingKey",
        "ArtsyTwitterStagingSecret",
        "SegmentProductionWriteKey",
        "SegmentDevWriteKey",
        "AdjustProductionAppToken"
    ]
}

target 'Artsy' do

  # Networking
  pod 'AFNetworking', "~> 2.5"
  pod 'AFOAuth1Client', :git => "https://github.com/lxcid/AFOAuth1Client.git", :tag => "0.4.0"
  pod 'AFNetworkActivityLogger'
  pod 'SDWebImage', '>= 3.7.2' # 3.7.2 contains a fix that allows you to not force decoding each image, which uses lots of memory

  # Core
  pod 'ALPValidator'
  pod 'ARGenericTableViewController', :git => 'https://github.com/orta/ARGenericTableViewController.git'
  pod 'CocoaLumberjack', :git => 'https://github.com/CocoaLumberjack/CocoaLumberjack.git' # Unreleased > 2.0.1 version has a CP modulemap fix
  pod 'FLKAutoLayout', :git => 'https://github.com/alloy/FLKAutoLayout.git', :branch => 'add-support-for-layout-guides-take-2'
  pod 'FXBlurView'
  pod 'iRate'
  pod 'ISO8601DateFormatter', :head
  pod 'JLRoutes', :git => 'https://github.com/orta/JLRoutes.git'
  pod 'JSBadgeView'
  pod 'JSDecoupledAppDelegate', :git => 'https://github.com/orta/JSDecoupledAppDelegate.git', :branch => 'patch-1'
  pod 'Mantle', '~> 1.5.6'
  pod 'MMMarkdown'
  pod 'NPKeyboardLayoutGuide'
  pod 'ReactiveCocoa'
  pod 'UICKeyChainStore'

  # Core owned by Artsy
  pod 'ARTiledImageView', :git => 'https://github.com/dblock/ARTiledImageView'
  pod 'ARCollectionViewMasonryLayout'
  pod 'ORStackView', :git => 'https://github.com/1aurabrown/ORStackView.git'
  pod 'UIView+BooleanAnimations'
  pod 'NAMapKit', :git => 'https://github.com/neilang/NAMapKit'

  # Deprecated:
  # UIAlertView is deprecated for iOS8 APIs
  pod 'UIAlertView+Blocks'

  # Language Enhancments
  pod 'KSDeferred'
  pod 'MultiDelegate'
  pod 'ObjectiveSugar'

  # X-Callback-Url support
  pod 'InterAppCommunication'

  # Artsy Spec repo stuff
  pod 'Artsy-UIButtons'
  pod 'Artsy+UIColors'
  pod 'Artsy+UILabels', '>= 1.3.2'

  if ENV['ARTSY_STAFF_MEMBER'] != nil || ENV['CI'] != nil
    pod 'Artsy+UIFonts', :git => "https://github.com/artsy/Artsy-UIFonts.git", :branch => "old_fonts_new_lib"
  else
    pod 'Artsy+OSSUIFonts'
  end

  # Facebook
  pod 'FBSDKCoreKit'
  pod 'FBSDKLoginKit'

  # Analytics
  pod 'Analytics', :head
  pod 'ARAnalytics', :git => 'https://github.com/orta/ARAnalytics.git', :subspecs => ["Segmentio", "HockeyApp", "Adjust", "DSL"]

  # Developer Pods
  pod 'DHCShakeNotifier'
  pod 'ORKeyboardReactingApplication'
  pod 'VCRURLConnection'

  # Easter Eggs
  pod 'ARASCIISwizzle'
  pod 'DRKonamiCode'

  target 'Artsy Tests' do
    inherit! :search_paths

    pod 'FBSnapshotTestCase'
    pod 'Expecta+Snapshots'
    pod 'OHHTTPStubs'
    pod 'XCTest+OHHTTPStubSuiteCleanUp'
    pod 'Specta'
    pod 'Expecta'
    pod 'OCMock'
  end
end

post_install do |installer|
  # Disable bitcode for now. Specifically needed for HockeySDK and ARAnalytics.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end

  app_plist = "Artsy/App_Resources/Artsy-Info.plist"
  plist_buddy = "/usr/libexec/PlistBuddy"
  version = `#{plist_buddy} -c "Print CFBundleShortVersionString" #{app_plist}`.strip
  puts "Updating CocoaPods' version numbers to #{version}"

  installer.pods_project.targets.each do |target|
    `#{plist_buddy} -c "Set CFBundleShortVersionString #{version}" "Pods/Target Support Files/#{target}/Info.plist"`
  end
end
