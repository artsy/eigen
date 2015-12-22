source 'https://github.com/artsy/Specs.git'
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '8.0'

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
  pod 'ARTiledImageView', :git => 'https://github.com/dblock/ARTiledImageView', :commit => '1a31b864d1d56b1aaed0816c10bb55cf2e078bb8'
  pod 'ARCollectionViewMasonryLayout'
  pod 'ORStackView', :git => 'https://github.com/1aurabrown/ORStackView.git'
  pod 'UIView+BooleanAnimations'
  pod 'NAMapKit', :git => 'https://github.com/neilang/NAMapKit', :commit => '62275386978db91b0e7ed8de755d15cef3e793b4'

  # Deprecated:
  # UIAlertView is deprecated for iOS8 APIs
  pod 'UIAlertView+Blocks'
  # Code isn't used, and should be removed
  pod 'FODFormKit', :git => 'https://github.com/1aurabrown/t.git'

  # Language Enhancments
  pod 'KSDeferred'
  pod 'libextobjc', :subspecs => ['EXTKeyPathCoding', 'EXTScope']
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
end

target 'Artsy Tests' do
  pod 'FBSnapshotTestCase'
  pod 'Expecta+Snapshots'
  pod 'OHHTTPStubs'
  pod 'XCTest+OHHTTPStubSuiteCleanUp'
  pod 'Specta'
  pod 'Expecta'
  pod 'OCMock'
end

post_install do |installer|
  # Disable bitcode for now. Specifically needed for HockeySDK and ARAnalytics.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end
end
