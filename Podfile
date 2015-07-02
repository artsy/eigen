source 'https://github.com/artsy/Specs.git'
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '8.0'

# Yep.
inhibit_all_warnings!
use_frameworks!

# Allows per-dev overrides
local_podfile = "Podfile.local"
eval(File.open(local_podfile).read) if File.exist? local_podfile

# Include my pods in the install stats
plugin 'cocoapods-stats'
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
        "SegmentDevWriteKey"
    ]
}

target 'Artsy' do
  # Core

  pod 'Mantle', '1.5.3'
  pod 'AFNetworking', :git => 'https://github.com/orta/AFNetworking', :branch => 'no_ifdefs'
  pod 'AFHTTPRequestOperationLogger', '1.0.0'
  pod 'SDWebImage', '3.7.1'
  pod 'JLRoutes', '1.5'
  pod 'ISO8601DateFormatter', :head
  pod 'KSDeferred', '0.2.0'
  pod 'JSDecoupledAppDelegate', '1.1.0'
  pod 'CocoaLumberjack', '~> 2.0'
  pod 'FXBlurView', '1.6.1'
  pod 'MMMarkdown', '0.4'
  pod 'UIAlertView+Blocks', '0.8'
  pod 'iRate', '1.10.2'
  pod 'MultiDelegate', '0.0.2'
  pod 'ReactiveCocoa', '2.3'
  pod 'ALPValidator', '0.0.3'
  pod 'ORKeyboardReactingApplication', '0.5.3'
  pod 'ORStackView', :git => 'https://github.com/1aurabrown/ORStackView.git'
  pod 'ARTiledImageView', :git => 'https://github.com/dblock/ARTiledImageView', :commit => '1a31b864d1d56b1aaed0816c10bb55cf2e078bb8'
  pod 'ARCollectionViewMasonryLayout', '~> 2.1', '>= 2.1.2'
  pod 'ARGenericTableViewController', '1.0.2'
  pod 'FLKAutoLayout', '0.1.1'

  # X-Callback-Url support
  pod 'InterAppCommunication'

  # Artsy Spec repo stuff
  pod 'Artsy+UILabels', :head
  pod 'Artsy+UIColors'
  pod 'Artsy-UIButtons', '~> 1.4'
  pod 'UIView+BooleanAnimations'

  if %w(orta ash artsy laura eloy sarahscott).include?(ENV['USER']) || ENV['CI'] == 'true'
    pod 'Artsy+UIFonts', :git => "https://github.com/artsy/Artsy-UIFonts.git", :branch => "old_fonts_new_lib"
  else
    pod 'Artsy+OSSUIFonts'
  end

  # Auth
  pod 'FBSDKCoreKit', '~> 4.2'
  pod 'FBSDKLoginKit', '~> 4.2'

  pod 'AFOAuth1Client', :git => "https://github.com/orta/AFOAuth1Client", :branch => "patch-1"

  # Language niceities
  pod 'ObjectiveSugar', '1.1.0'

  # libextobjc
  pod 'libextobjc/EXTKeyPathCoding', '0.4'
  pod 'libextobjc/EXTScope', '0.4'

  # Martsy
  pod 'TSMiniWebBrowser@dblock', :head

  # Table View simplification
  pod 'FODFormKit', :git => 'https://github.com/1aurabrown/FODFormKit.git'

  # Analytics
  pod 'HockeySDK-Source', '~> 3.7'
  pod 'ARAnalytics', '>= 3.6.2', :subspecs => ["Segmentio", "HockeyApp", "DSL"]
  pod 'UICKeyChainStore', '1.0.5'

  # Fairs
  pod 'NAMapKit', :git => 'https://github.com/neilang/NAMapKit', :commit => '62275386978db91b0e7ed8de755d15cef3e793b4'

  # Developer Pods
  pod 'VCRURLConnection', '0.2.0'
  pod 'DHCShakeNotifier', '0.2.0'

  # Easter Eggs
  pod 'ARASCIISwizzle', '1.1.0'
  pod 'DRKonamiCode', '1.1.0'
end

target 'Artsy Tests' do
  pod 'FBSnapshotTestCase'
  pod 'Expecta+Snapshots', '1.3.4'
  pod 'OHHTTPStubs', '3.1.2'
  pod 'XCTest+OHHTTPStubSuiteCleanUp', '1.0.0'
  pod 'Specta'
  pod 'Expecta'
  pod 'OCMock', '2.2.4'
end

# Yep.
inhibit_all_warnings!
