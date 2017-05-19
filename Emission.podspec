require 'json'

root = ENV["EMISSION_ROOT"] || __dir__
pkg_version = lambda do |dir_from_root = ''|
  path = File.join(root, dir_from_root, 'package.json')
  JSON.load(File.read(path))['version']
end

emission_version = pkg_version.call
react_native_version = pkg_version.call('node_modules/react-native')
sentry_version = pkg_version.call('node_modules/react-native-sentry')

Pod::Spec.new do |s|
  s.name           = 'Emission'
  s.version        = emission_version
  s.summary        = 'React Native Components used by Eigen.'
  s.homepage       = 'https://github.com/artsy/emission'
  s.license        = 'MIT'
  s.author         = { 'Eloy Durán' => 'eloy@artsy.net',
                       'Maxim Cramer' => 'maxim@artsy.net',
                       'Sarah Scott' => 'sarah.scott@artsy.net' }
  s.source         = { :git => 'https://github.com/artsy/emission.git', :tag => "v#{s.version}" }
  s.platform       = :ios, '8.0'
  s.requires_arc   = true
  s.source_files   = 'Pod/Classes/**/*.{h,m}'
  s.resources      = 'Pod/Assets/{Emission.js,assets}'

  s.dependency 'Artsy+UIFonts', '>= 3.0.0'
  s.dependency 'Extraction', '>= 1.2.1'

  s.dependency 'Yoga', "#{react_native_version}.React"
  s.dependency 'React/Core', react_native_version
  s.dependency 'React/RCTText', react_native_version
  s.dependency 'React/RCTImage', react_native_version
  s.dependency 'React/RCTNetwork', react_native_version

  s.dependency 'SDWebImage', '>= 3.7.2', '< 4'
  # This needs to be locked down because we’re including this specific version’s JS in our bundle, so it needs to match
  # with the SentryReactNative version that CocoaPods would pull into Eigen.
  s.dependency 'SentryReactNative', sentry_version
end
