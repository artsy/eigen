class Pod::Project
  def predictabilize_uuids
    # no-op to ensure we can use this branch, but without the, currently for us broken, persistant UUID change in Xcodeproj:
    # https://github.com/CocoaPods/CocoaPods/tree/seg-embed-frameworks-quotes
    #
    # Remove this and change Gemfile to latest CP once this is fixed:
    # https://github.com/CocoaPods/CocoaPods/issues/3763
  end
end

source 'https://github.com/artsy/Specs.git'
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '8.0'

# Yep.
inhibit_all_warnings!
use_frameworks!

# Allows per-dev overrides
local_podfile = "Podfile.local"
eval(File.open(local_podfile).read) if File.exist? local_podfile

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
  pod 'AFNetworking', :git => 'https://github.com/orta/AFNetworking', :branch => 'no_ifdefs'
  pod 'AFOAuth1Client', :git => "https://github.com/orta/AFOAuth1Client", :branch => "patch-1"
  pod 'AFHTTPRequestOperationLogger'
  pod 'SDWebImage'

  # Core
  pod 'ALPValidator'
  pod 'ARGenericTableViewController'
  pod 'CocoaLumberjack'
  pod 'FLKAutoLayout', :git => 'https://github.com/alloy/FLKAutoLayout.git', :branch => 'add-support-for-layout-guides-take-2'
  pod 'FXBlurView'
  pod 'iRate'
  pod 'ISO8601DateFormatter', :head
  pod 'JLRoutes'
  pod 'JSBadgeView'
  pod 'JSDecoupledAppDelegate'
  pod 'Mantle'
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
  pod 'FODFormKit', :git => 'https://github.com/1aurabrown/FODFormKit.git'

  # Language Enhancments
  pod 'KSDeferred'
  pod 'libextobjc/EXTKeyPathCoding'
  pod 'MultiDelegate'
  pod 'ObjectiveSugar'
  pod 'TPDWeakProxy'

  # X-Callback-Url support
  pod 'InterAppCommunication'

  # Artsy Spec repo stuff
  pod 'Artsy-UIButtons'
  pod 'Artsy+UIColors'
  pod 'Artsy+UILabels'

  if %w(orta ash artsy laura eloy sarahscott jorystiefel).include?(ENV['USER']) || ENV['CI'] == 'true'
    pod 'Artsy+UIFonts', :git => "https://github.com/artsy/Artsy-UIFonts.git", :branch => "old_fonts_new_lib"
  else
    pod 'Artsy+OSSUIFonts'
  end

  # Facebook
  pod 'FBSDKCoreKit'
  pod 'FBSDKLoginKit'

  # Martsy / Force integration
  pod 'TSMiniWebBrowser@dblock', :head

  # Analytics
  pod 'ARAnalytics', '>= 3.6.2', :subspecs => ["Segmentio", "HockeyApp", "Adjust", "DSL"]

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
