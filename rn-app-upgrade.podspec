require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.summary      = package["description"]
  s.author       = package["author"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/songxiaoliang/react-native-app-upgrade.git", :tag => "v#{s.version}" }
  s.pod_target_xcconfig = { 'USER_HEADER_SEARCH_PATHS' => '"$(SRCROOT)/../node_modules/rn-app-upgrade/ios_upgrade"' }
  s.source_files  = "ios_upgrade/*.{h,m}"
  s.dependency "React"
end
