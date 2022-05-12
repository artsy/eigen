#!/usr/bin/env ruby


def remove_mapbox_creds
  $netrc_path = File.expand_path('~/.netrc')
  if File.exists?(".i-had-a-netrc-file")
    contents = File.read($netrc_path)
    cleaned = contents.gsub(/machine api\.mapbox\.com\nlogin mapbox\npassword .*$/, "")
    File.open($netrc_path, 'w') { |f|
      f.write(cleaned)
    }
  else
    File.delete($netrc_path) if File.exist?($netrc_path)
  end
end

remove_mapbox_creds


def fix_fonts_in_uifonts_pod
  # inspired by https://github.com/artsy/Artsy-OSSUIFonts/blob/master/Pod/Scripts/ArtsySetup.rb while we still use that pod

  system("./scripts/download-fonts")

  font_file = "ios/Pods/Artsy+UIFonts/Pod/Classes/UIFont+ArtsyFonts.m"
  system("chmod +w #{font_file}")
  contents = File.read(font_file)
  changed = contents.gsub(/static BOOL useClosedFonts = false;/, "static BOOL useClosedFonts = true;")
  File.write(font_file, changed)
end

fix_fonts_in_uifonts_pod
