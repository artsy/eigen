using_bundler = defined? Bundler
unless using_bundler
  puts "\nPlease re-run using:".red
  puts "  bundle exec pod install\n\n"
  exit(1)
end


source 'https://github.com/artsy/Specs.git'
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '9.0'
inhibit_all_warnings!

EMISSION_VERSION = '1.19.0'
require 'down'
require 'json'
require 'fileutils'

system 'mkdir rn_pods' unless File.exists?('./rn_pods')

# Check if the version we're installing is the same as what we already have installed.
needs_install = true # Assume it's true until we know otherwise
if File.exists? './rn_pods/package.json'
  emission_package = JSON.parse(File.read('./rn_pods/package.json'), symbolize_names: true)
  needs_install = emission_package[:version] != EMISSION_VERSION
end

if needs_install
  puts 'Installing Emission packages to reference locally.'
  system 'rm -rf rn_pods/*' # Clear all existing pods.
  tempfile = Down.download("https://raw.githubusercontent.com/artsy/emission/v#{EMISSION_VERSION}/package.json")
  FileUtils.mv(tempfile.path, "./rn_pods/#{tempfile.original_filename}")
  tempfile = Down.download("https://raw.githubusercontent.com/artsy/emission/v#{EMISSION_VERSION}/yarn.lock")
  FileUtils.mv(tempfile.path, "./rn_pods/#{tempfile.original_filename}")
  tempfile = Down.download("https://raw.githubusercontent.com/artsy/emission/v#{EMISSION_VERSION}/npm-podspecs.json")
  FileUtils.mv(tempfile.path, "./rn_pods/#{tempfile.original_filename}")
  system 'pushd rn_pods ; yarn install --ignore-scripts ; popd'
else
  puts 'Skipping Emission node_modules install.'
end

npm_vendored_podspecs = JSON.parse(File.read('./rn_pods/npm-podspecs.json'), symbolize_names: true)
npm_vendored_podspecs.update(npm_vendored_podspecs) do |_pod_name, props|
  if props[:path]
    props.merge path: File.join('./rn_pods/', props[:path])
  else
    props.merge podspec: File.join('./rn_pods/', props[:podspec])
  end
end

# Remove DevSupport pod on CI builds, which are used to deploy prod builds.
if ENV['CIRCLE_BUILD_NUM']
  npm_vendored_podspecs['React-Core'.to_sym].delete(:subspecs)
end


# Note: These should be reflected _accurately_ in the environment of
#       the continuous build server.

plugin 'cocoapods-keys',
       project: 'Artsy',
       target: 'Artsy',
       keys: [
         'ArtsyAPIClientSecret',      # Authing to the Artsy API
         'ArtsyAPIClientKey',         #
         'ArtsyFacebookAppID',        # Supporting FB Login
         'SegmentProductionWriteKey', # Analytics
         'SegmentDevWriteKey',        #
         'AdjustProductionAppToken',  # Marketing
         'ArtsyEchoProductionToken',  # Runtime behavior changes
         'SentryProductionDSN',       # Crash Logging
         'SentryStagingDSN',          #
         'GoogleMapsAPIKey', # Consignment Location Lookup,
         'MapBoxAPIClientKey' # Used in local discovery
       ]

target 'Artsy' do
  # Networking
  pod 'AFNetworking', '~> 2.5'
  pod 'AFOAuth1Client', git: 'https://github.com/lxcid/AFOAuth1Client.git', tag: '0.4.0'
  pod 'AFNetworkActivityLogger'
  pod 'SDWebImage', '>= 3.7.2' # 3.7.2 contains a fix that allows you to not force decoding each image, which uses lots of memory

  # Core
  pod 'ARGenericTableViewController', git: 'https://github.com/orta/ARGenericTableViewController.git'
  pod 'CocoaLumberjack', git: 'https://github.com/CocoaLumberjack/CocoaLumberjack.git' # Unreleased > 2.0.1 version has a CP modulemap fix
  pod 'FLKAutoLayout', git: 'https://github.com/orta/FLKAutoLayout.git', branch: 'v1'
  pod 'FXBlurView'
  pod 'iRate'
  pod 'ISO8601DateFormatter', git: 'https://github.com/orta/iso-8601-date-formatter'
  pod 'JLRoutes', git: 'https://github.com/orta/JLRoutes.git'
  pod 'JSDecoupledAppDelegate'
  pod 'Mantle', '~> 1.5.6'
  pod 'MMMarkdown'
  pod 'NPKeyboardLayoutGuide'
  pod 'ReactiveObjC'
  pod 'UICKeyChainStore'
  pod 'MARKRangeSlider'
  pod 'EDColor'
  pod 'SSFadingScrollView', git: 'https://github.com/alloy/SSFadingScrollView.git', branch: 'add-axial-support'

  # Core owned by Artsy
  pod 'ARTiledImageView', git: 'https://github.com/dblock/ARTiledImageView'
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

  pod 'Emission', EMISSION_VERSION
  npm_vendored_podspecs.each do |pod_name, props|
    pod pod_name.to_s, props
  end

  # Emission's dependencies
  # use `cat ~/.cocoapods/repos/artsy/Emission/1.x.x/Emission.podspec.json` to see the Podspec

  # For Stripe integration with Emission. Using Ash's fork for this issue: https://github.com/tipsi/tipsi-stripe/issues/408
  pod 'Pulley', :git => 'https://github.com/l2succes/Pulley.git', :branch => 'master'

  # Facebook
  pod 'FBSDKCoreKit', '~> 4.33'
  pod 'FBSDKLoginKit', '~> 4.33'

  # Analytics
  pod 'Analytics'
  pod 'ARAnalytics', subspecs: %w[Segmentio Adjust DSL]

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
  emission_podspec_json = installer.pod_targets.find { |f| f.name == "Emission" }.specs[0].to_json
  File.write("Pods/Local Podspecs/Emission.podspec.json", emission_podspec_json)

  # Note: we don't want Echo.json checked in, so Artsy staff download it at pod install time. We
  # use a stubbed copy for OSS developers.
  echo_key = `bundle exec pod keys get ArtsyEchoProductionToken Artsy`
  if echo_key.length > 1 # OSS contributors have "-" as their key
    puts "Updating Echo..."
    `make update_echo &> /dev/null`
  end

  # Disable bitcode for now. Specifically needed for HockeySDK and ARAnalytics.
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end

  # Forces the minimum to be 8.0 as that's our last deployment targer, and new xcode build tools
  # give an error in Xcode 10
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 8.0
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '8.0'
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
      if swift4.include?(target.name)
        config.build_settings['SWIFT_VERSION'] = '4.0'
      end
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
    patched = contents.sub(/["<]\w+\/(\w+-Swift\.h)[">]/, '"\1"')
    File.write(header, patched) if Regexp.last_match
  end
end
