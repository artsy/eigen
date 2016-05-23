Pod::Spec.new do |s|
  s.name         = "Emission"
  s.version      = "0.1.0"
  s.summary      = "React Native Components used by Eigen."
  s.homepage     = "https://github.com/artsy/emission"
  s.license      = 'MIT'
  s.author       = { "Eloy Durán" => "eloy.de.enige@gmail.com" }
  s.source       = { :git => "https://github.com/artsy/emission.git", :tag => s.version.to_s }
  s.platform     = :ios, '8.0'
  s.requires_arc = true

  s.default_subspec = 'All'

  s.subspec 'All' do |ss|
    ss.dependency 'Emission/Core'
    ss.dependency 'Emission/OpaqueImageViewComponent'
    ss.dependency 'Emission/SwitchViewComponent'
    ss.dependency 'Emission/SpinnerComponent'
    ss.dependency 'Emission/TemporaryAPI'
    ss.dependency 'Emission/ViewControllers'
  end

  s.subspec 'Core' do |ss|
    ss.source_files = 'Pod/Classes/Core'
    ss.resource = 'Pod/Assets/Emission.jsbundle'
    ss.dependency 'Artsy+UIFonts', '>= 1.1.0'

    react_version = '>= 0.24.0-rc5'
    ss.dependency 'React/Core', react_version
    ss.dependency 'React/RCTText', react_version
    ss.dependency 'React/RCTNetwork', react_version
  end

  s.subspec 'TemporaryAPI' do |ss|
    ss.source_files = 'Pod/Classes/TemporaryAPI'
    ss.dependency 'Emission/Core'
  end

  s.subspec 'SwitchViewComponent' do |ss|
    ss.source_files = 'Pod/Classes/SwitchViewComponent'
    ss.dependency 'Emission/Core'
    ss.dependency 'Extraction/ARSwitchView'
  end

  s.subspec 'SpinnerComponent' do |ss|
    ss.source_files = 'Pod/Classes/SpinnerComponent'
    ss.dependency 'Emission/Core'
    ss.dependency 'Extraction/ARSpinner'
  end

  s.subspec 'OpaqueImageViewComponent' do |ss|
    ss.source_files = 'Pod/Classes/OpaqueImageViewComponent'
    ss.dependency 'SDWebImage', '>= 3.7.2'
  end

  s.subspec 'ViewControllers' do |ss|
    ss.source_files = 'Pod/Classes/ViewControllers'
    ss.dependency 'Emission/Core'
  end
end
