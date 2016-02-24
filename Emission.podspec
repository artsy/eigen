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
  s.source_files = 'Pod/Classes/**/*'
end
