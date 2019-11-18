require 'json'
require 'date'

root = ENV['EMISSION_ROOT'] || __dir__
pkg_version = lambda do |dir_from_root = '', version = 'version'|
  _path = File.join(root, dir_from_root, 'package.json')
  JSON.load(File.read(_path))[version]
end

emission_version = pkg_version.call
emission_native_version = pkg_version.call('', 'native-code-version')
react_native_version = pkg_version.call('node_modules/react-native')

podspec = Pod::Spec.new do |s|
  s.name           = 'Emission'
  s.version        = emission_version
  s.summary        = 'React Native Components used by Eigen.'
  s.homepage       = 'https://github.com/artsy/emission'
  s.license        = 'MIT'
  s.author         = { 'Artsy Mobile' => 'mobile@artsy.net' }
  s.source         = { git: 'https://github.com/artsy/emission.git', tag: "v#{s.version}" }
  s.platform       = :ios, '9.0'
  s.source_files   = 'Pod/Classes/**/*.{h,m}'
  s.preserve_paths = 'Pod/Classes/**/*.generated.objc'
  s.resources      = 'Pod/Assets/{Emission.js,assets,PreHeatedGraphQLCache}'

  # Artsy UI dependencies
  s.dependency 'Artsy+UIColors'
  s.dependency 'Artsy+UIFonts', '>= 3.0.0'
  s.dependency 'Extraction', '>= 1.2.1'

  # Used in City Guides
  s.dependency 'Pulley'

  # Used in ARGraphQLQueryCache
  s.dependency 'ISO8601DateFormatter'

  # To ensure a consistent image cache between app/lib
  s.dependency 'SDWebImage', '>= 3.7.2', '< 4'

  # For custom animations in DeepZoomOverlay
  s.dependency 'INTUAnimationEngine'

  # React, and the subspecs we have to use
  s.dependency 'React-Core', react_native_version
  s.dependency 'React-cxxreact', react_native_version
  s.dependency 'React-RCTAnimation', react_native_version
  s.dependency 'React-RCTImage', react_native_version
  s.dependency 'React-RCTLinking', react_native_version
  s.dependency 'React-RCTNetwork', react_native_version
  s.dependency 'React-RCTText', react_native_version
  # s.dependency 'React-RCTGeolocation', react_native_version
  s.dependency 'React-RCTActionSheet', react_native_version

  # React's Dependencies
  # s.dependency 'Yoga', "#{react_native_version}.React"
  react_podspecs = [
    'node_modules/react-native/third-party-podspecs/DoubleConversion.podspec',
    'node_modules/react-native/third-party-podspecs/Folly.podspec',
    'node_modules/react-native/third-party-podspecs/glog.podspec'
  ]

  # Native dependencies of Emission, which come from node_modules
  dep_podspecs = [
    'node_modules/tipsi-stripe/tipsi-stripe.podspec',
    'node_modules/@mapbox/react-native-mapbox-gl/react-native-mapbox-gl.podspec',
    'node_modules/react-native-sentry/SentryReactNative.podspec',
    'node_modules/react-native-svg/RNSVG.podspec',
    'node_modules/react-native-navigator-ios/react-native-navigator-ios.podspec',
    'node_modules/@react-native-community/cameraroll/react-native-cameraroll.podspec',
    'node_modules/@react-native-community/geolocation/react-native-geolocation.podspec'
  ]

  # Ties the exact versions so host apps don't need to guess the version
  # or have a potential mismatch
  podspecs = react_podspecs + dep_podspecs
  podspecs.each do |podspec_path|
    spec = Pod::Specification.from_file podspec_path
    s.dependency spec.name, spec.version.to_s
  end
end

if ENV['INCLUDE_METADATA']
  # Attach the useful metadata to the podspec, which can be used in admin tools
  podspec.attributes_hash['native_version'] = emission_native_version
  podspec.attributes_hash['release_date'] = DateTime.now.strftime('%h %d, %Y')
  podspec.attributes_hash['sha'] = `git rev-parse HEAD`.strip
  podspec.attributes_hash['react_native_version'] = react_native_version
  podspec.attributes_hash['app_registry'] = File.read('./src/lib/AppRegistry.tsx').scan(/AppRegistry.registerComponent\(\"(.*)\"/).flatten
end

podspec
