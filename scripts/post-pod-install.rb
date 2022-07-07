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
