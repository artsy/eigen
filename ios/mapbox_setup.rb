# Writes a temporary Mapbox download token to ~/.netrc so CocoaPods can
# authenticate against api.mapbox.com. Cleaned up by scripts/setup/post-pod-install.rb.
def setup_mapbox_credentials
  mapbox_token = ENV['MAPBOX_DOWNLOAD_TOKEN']
  if !mapbox_token || mapbox_token.length <= 1
    raise "You need a MAPBOX_DOWNLOAD_TOKEN in your .env.shared file.\nIf you work at artsy, check 1password.\nOtherwise create your own in the mapbox dashboard. https://docs.mapbox.com/ios/maps/guides/install"
  end

  $netrc_path = File.expand_path('~/.netrc')
  if File.exists?($netrc_path)
    system("touch .i-had-a-netrc-file")
  else
    system("rm -rf .i-had-a-netrc-file")
  end

  File.open($netrc_path, 'a+', 0600) { |f|
    f.write("machine api.mapbox.com\nlogin mapbox\npassword #{mapbox_token}\n")
  }
end
