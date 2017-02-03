require 'json'

npm_package = JSON.load(File.read(File.expand_path('../package.json', __FILE__)))

Pod::Spec.new do |s|
  s.name           = 'Emission'
  s.version        = npm_package['version']
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

  # Artsy pods
  s.dependency 'Artsy+UIFonts', '>= 3.0.0'
  s.dependency 'Extraction', '>= 1.2.1'

  # 3rd-party pods
  s.dependency 'SDWebImage', '>= 3.7.2'
  react_native_version = npm_package['dependencies']['react-native'].sub('^', '~>')
  s.dependency 'React/Core', react_native_version
  s.dependency 'React/RCTText', react_native_version
  s.dependency 'React/RCTImage', react_native_version
  s.dependency 'React/RCTNetwork', react_native_version
end
