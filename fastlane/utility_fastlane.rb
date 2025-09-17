require "pathname"

# Utility functions

desc "Updates the version string in app.json"
lane :update_version_string do |options|
  new_version = options[:version] || prompt(text: "What is the new human-readable release version?")
  $APP_JSON['version'] = new_version
  write_contents_to_file($APP_JSON_PATH, JSON.pretty_generate($APP_JSON))
end

desc "Checks app store connect if a license agreement needs to be signed"
lane :notify_if_new_license_agreement do
  # TODO: This login method uses a stored session, expires every 30 days and needs to be refreshed via
  # `bundle exec fastlane spaceauth`
  # then update the session env var in .env.releases with the output session
  # this is annoying, keep an eye out for token based auth in future
  client = Spaceship::Tunes.login
  client.team_id = '479887'
  messages = Spaceship::Tunes.client.fetch_program_license_agreement_messages

  # ignore membership expiration warnings, auto-renew should take care of
  if messages.empty? || messages[0].include?('membership expiration')
    puts 'No new developer agreements'
  else
    message = <<~MSG
                :apple: :handshake: :pencil:
                There is a new developer program agreement that needs to be signed to continue shipping!
                Reach out to legal :scales: for approval before signing.
                https://appstoreconnect.apple.com/agreements/#/
              MSG
    puts message
    puts messages[0]
    slack(
      message: message,
      success: false,
      default_payloads: []
    )
  end
end

desc "Notifies in slack if a maestro test failed"
lane :report_maestro_failure do |options|
  s3_url = options[:s3_url]
  error_message = options[:error_message]
  flow_name = options[:flow_name]
  platform = options[:platform] || "unknown"
  puts platform
  # Set platform-specific icon
  platform_icon = case platform.downcase
                  when "ios"
                    "🍏"
                  when "android"
                    "🤖"
                  else
                    "📱"
                  end

  message = <<~MSG
              :x: :tophat:
              Maestro test failed for #{platform_icon} #{platform}!
              Flow: #{flow_name}
              Error: `#{error_message}`
              Screenshot at time of failure:
              #{s3_url}
              See github action run for more details.
            MSG

  # Construct GitHub Actions run URL
  github_repo = ENV['GITHUB_REPOSITORY']
  run_id = ENV['GITHUB_RUN_ID']
  github_url = "https://github.com/#{github_repo}/actions/runs/#{run_id}"
  slack(
    channel: '#mobile-alerts',
    message: message,
    success: false,
    payload: {
      'GitHub Actions' => github_url
    },
    default_payloads: []
  )
end

desc "Notifies in slack if a beta failed to deploy"
lane :notify_beta_failed do |options|
  exception = options[:exception]
  message = <<~MSG
              :x: :iphone:
              Looks like the latest eigen beta failed to deploy!
              See GitHub action run for more details.
            MSG

  # Construct GitHub Actions run URL
  github_repo = ENV['GITHUB_REPOSITORY']
  run_id = ENV['GITHUB_RUN_ID']
  github_url = "https://github.com/#{github_repo}/actions/runs/#{run_id}"

  slack(
    message: message,
    success: false,
    payload: {
      'GitHub Actions' => github_url,
      'Exception' => exception.message
    },
    default_payloads: []
  )
end

desc "Notifies in slack if a new beta is needed"
lane :notify_beta_needed do
  message = <<~MSG
              :warning: :iphone:
              [Eigen](https://github.com/artsy/eigen) Native code has changed, new testflight needed!
              Deploy new betas from main to keep testing.
            MSG
  slack(
    message: message,
    success: false,
    default_payloads: []
  )
end

# Build and upload iOS and Android builds to S3

lane :s3_upload_ios_build do |options|
  UI.message("Uploading iOS build to S3...")

  app_version = options[:app_version]
  archive_root = options[:archive_root] || "../archives"
  app_name = options[:app_name] || "Artsy"

  # Find latest archive
  pattern = File.join(archive_root, "#{app_name}*.xcarchive")
  matching_archives = Dir.glob(pattern)

  UI.user_error!("No .xcarchive found matching pattern #{pattern}") unless matching_archives.any?

  latest_archive = matching_archives.max_by { |f| File.mtime(f) }
  app_path = File.join(latest_archive, "Products/Applications/#{app_name}.app")
  UI.user_error!("App not found at #{app_path}") unless File.exist?(app_path)

  # Create zip
  zip_name = "#{app_name}-#{app_version}.zip"
  zip_path = File.join(archive_root, zip_name)
  latest_zip_path = File.join(archive_root, "#{app_name}-latest.zip")
  app_dir = File.dirname(app_path)
  app_folder = File.basename(app_path)
  zip_path_absolute = Pathname.new(zip_path).realpath.to_s rescue Pathname.new(zip_path).expand_path.to_s

  sh("cd '#{app_dir}' && zip -r '#{zip_path_absolute}' '#{app_folder}'")
  FileUtils.cp(zip_path, latest_zip_path)

  # Upload both versioned and "latest"
  sh("aws s3 cp #{zip_path} #{S3_IOS_BUILDS_PATH}#{zip_name}")
  sh("aws s3 cp #{latest_zip_path} #{S3_IOS_BUILDS_PATH}#{app_name}-latest.zip")

  UI.success("✅ Uploaded #{zip_name} and latest to S3")
end

lane :s3_upload_android_build do |options|
  app_version = options[:app_version]
  app_path = options[:app_path]
  sh('aws s3 cp ' + app_path + ' ' + S3_ANDROID_BUILDS_PATH + app_version.to_s + '.aab')
end

lane :tag_and_push do |options|
  # Do a tag, we use a http git remote so we can have push access
  # as the default remote for circle is read-only
  tag = options[:tag].strip
  `git tag -d "#{tag}"`
  add_git_tag tag: tag
  `git remote add http https://github.com/artsy/eigen.git || true`
  # use no-verify to skip the pre-push hook
  `git push http #{tag} -f --no-verify`
end

desc 'Create a new version in app store connect'
lane :create_next_app_version do |options|
  api_key = generate_app_store_connect_api_key

  next_version = options[:next_version_code]
  UI.message("Let's create a new app version #{next_version}.")

  deliver(
    api_key: api_key,
    app_version: next_version,
    skip_metadata: true,
    automatic_release: false,
    phased_release: false,
    submit_for_review: false
  )
end

desc "Prepares a new branch with version changes, pushes it, and creates a PR"
lane :prepare_version_update_pr do |options|
  version_change_branch = "version-update-#{Time.now.strftime('%Y%m%d%H%M%S')}"
  commit_message = options[:commit_message]

  sh "git add -A"
  sh "git commit -m '#{commit_message}'"

  sh "git remote add http https://github.com/artsy/eigen.git || true"  # '|| true' to ignore errors if remote already exists

  # Create the new branch in remote and push changes
  sh "git push origin HEAD:refs/heads/#{version_change_branch}"

  pr_url = create_pull_request(
    api_token: ENV["CHANGELOG_GITHUB_TOKEN_KEY"],
    repo: "artsy/eigen",
    title: commit_message,
    head: version_change_branch,
    assignees: ["brainbicycle", "gkartalis"],
    base: "main",
    body: "This PR updates the app version to prepare for next release. #nochangelog"
  )

  pr_url
end

lane :latest_betas do
  api_key = generate_app_store_connect_api_key
  parent_version_name = $APP_JSON['version']
  ios_build_number = latest_testflight_build_number(
    api_key: api_key
  )
  android_build_number = google_play_track_version_codes(
      track: 'alpha'
  ).first

  formatted_ios_build_number = format_build_number(ios_build_number.to_s)
  formatted_android_build_number = android_build_number.to_s

  ios_tag = "ios-#{parent_version_name}-#{formatted_ios_build_number}"
  android_tag = "android-#{parent_version_name}-#{formatted_android_build_number}"

  puts "[INFO] Parent latest version: #{parent_version_name}"
  puts "[INFO] iOS latest version: #{ios_build_number} (tag: #{ios_tag})"
  puts "[INFO] Android latest version: #{android_build_number} (tag: #{android_tag})"

  puts "[INFO] If you are creating a release candidate branch:"
  puts "[INFO] git checkout #{ios_tag}"
  puts "[INFO] git checkout -b #{parent_version_name}-release-candidate"
end

lane :check_flags do
  sh('yarn check-flags')
  flag_file = File.read('./flags.json')
  flags = JSON.parse(flag_file)
  hidden_flags = flags['hiddenFlags']

  if hidden_flags.nil? || hidden_flags.empty?
    puts '[INFO] No hidden flags found!'
  else

    hidden_flags_message = ''
    hidden_flags.each do |flag_name|
      hidden_flags_message += "\n :alert-orange: #{flag_name}"
    end

    message = <<~MSG
      :alert-orange: :checkered_flag: :steam_locomotive: :alert-orange:
      We are getting ready for an app release!

      *Did you forget to set readyForRelease to true :interrobang:*
      *Features HIDDEN in the upcoming release*:
      #{hidden_flags_message}

      If a feature here should be going out this release please follow the docs here:
      https://github.com/artsy/eigen/blob/main/docs/developing_a_feature.md#releasing-a-feature
      @onyx-devs @phires @amber-devs @diamond-devs @emerald-devs
    MSG
    slack(message: message, default_payloads: [], link_names: true)
  end
end

def generate_app_store_connect_api_key
  app_store_connect_api_key(
    key_id: ENV['ARTSY_APP_STORE_CONNECT_API_KEY_ID'],
    issuer_id: ENV['ARTSY_APP_STORE_CONNECT_API_KEY_ISSUER_ID'],
    key_content: ENV['ARTSY_APP_STORE_CONNECT_API_KEY_CONTENT_BASE64'],
    is_key_content_base64: true,
    in_house: false,
  )
end

def generate_spaceship_token
  Spaceship::ConnectAPI::Token.create(
    key_id: ENV['ARTSY_APP_STORE_CONNECT_API_KEY_ID'],
    issuer_id: ENV['ARTSY_APP_STORE_CONNECT_API_KEY_ISSUER_ID'],
    key: ENV['ARTSY_APP_STORE_CONNECT_API_KEY_CONTENT_BASE64'],
    is_key_content_base64: true,
    in_house: false
  )
end

def increment_version_number(current_version)
  major, minor, patch = current_version.split('.').map(&:to_i)
  new_minor = minor + 1
  "#{major}.#{new_minor}.#{patch}"
end

def format_build_number(build_number)
  # Apple's API returns truncated version/build numbers (eg: 2020.03.19.18 becomes 2020.3.19.18)
  # So we need to add back leading zeroes
  return nil if build_number.nil?

  build_version_components = build_number.split('.')
  detruncated_components = build_version_components.map do |comp|
    comp.length == 1 ? '0' + comp : comp
  end
  detruncated_components.join('.')
end

def should_silence_beta_failure?
  # Set this var in circleci if you want to silence beta failure alerts for a while
  # E.g. you are working on a ci change
  # Takes a date of format 2023-01-01, recommend only setting for 1 day in future
  silence_beta_failures_until = ENV['FASTLANE_SILENCE_BETA_FAILURES_UNTIL']
  return false unless silence_beta_failures_until

  silence_until_date = Date.parse(silence_beta_failures_until)
  silence_until_date > Date.today
end

def write_contents_to_file(path, contents)
  File.open(path, 'w') do |file|
    file.puts contents
  end
rescue => e
  UI.error("Failed to write to #{path}: #{e.message}")
end

def upload_ios_maestro_to_s3
  app_name = "Artsy"
  derived_data_path = ENV['DERIVED_DATA_PATH'] || 'derived_data'
  s3_dest = "#{S3_IOS_BUILDS_PATH}#{app_name}-latest.zip"
  configuration = "QA"

  # Find the .app bundle
  project_root = File.expand_path('..')
  full_derived_data_path = File.expand_path(derived_data_path, project_root)
  app_search_pattern = "#{full_derived_data_path}/Build/Products/#{configuration}-iphonesimulator/#{app_name}.app"
  app_path = Dir.glob(app_search_pattern).first

  if app_path.nil? || !File.exist?(app_path)
    UI.error("❌ .app not found at: #{app_search_pattern}")
    UI.error("Searched in: #{full_derived_data_path}/Build/Products/#{configuration}-iphonesimulator/")
    raise "iOS Maestro app build not found"
  end

  UI.success("✅ Found app at: #{app_path}")

  # Zip the .app bundle
  zip_name = "#{app_name}-latest.zip"
  app_dir = File.dirname(app_path)
  app_basename = File.basename(app_path)

  Dir.chdir(app_dir) do
    sh("zip -r #{zip_name} #{app_basename}")
  end

  # Upload to S3
  zip_path = File.join(app_dir, zip_name)
  sh("aws s3 cp #{zip_path} #{s3_dest}")
  UI.success("✅ Uploaded #{zip_name} to #{s3_dest}")
end

def upload_android_maestro_to_s3(apk_path)
  app_name = "Artsy"
  s3_dest = "#{S3_ANDROID_BUILDS_PATH}#{app_name}-latest.apk"

  if apk_path.nil? || !File.exist?(apk_path)
    UI.error("❌ Maestro APK not found at: #{apk_path}")
    raise "Android Maestro app build not found"
  end

  UI.success("✅ Found apk at: #{apk_path}")

  # Copy and rename the APK for consistent S3 naming
  apk_name = "#{app_name}-latest.apk"
  sh("cp #{apk_path} #{apk_name}")

  # Upload to S3
  sh("aws s3 cp #{apk_name} #{s3_dest}")
  UI.success("✅ Uploaded #{apk_name} to #{s3_dest}")
end

def ios_build_params(deployment_target)
  case deployment_target
  when 'testflight'
    {
      build_path: "archives",
      workspace: 'ios/Artsy.xcworkspace',
      scheme: 'Artsy',
      export_method: 'app-store',
      codesigning_identity: 'Apple Distribution: Art.sy Inc. (23KMWZ572J)',
      silent: true
    }
  when 'firebase'
    {
      build_path: "archives",
      workspace: 'ios/Artsy.xcworkspace',
      scheme: 'Artsy (QA)',
      export_method: 'ad-hoc',
      codesigning_identity: 'Apple Distribution: Art.sy Inc. (23KMWZ572J)',
      silent: true
    }
  when 'maestro'
    {
      derived_data_path: "derived_data",
      build_path: "archives",
      workspace: 'ios/Artsy.xcworkspace',
      scheme: 'Artsy (QA)',
      export_method: "development",
      codesigning_identity: 'Apple Distribution: Art.sy Inc. (23KMWZ572J)',
      skip_archive: true,
      configuration: 'QA',
      destination: 'generic/platform=iOS Simulator',
      silent: true,
      sdk: 'iphonesimulator',
      xcargs: "GCC_PREPROCESSOR_DEFINITIONS='$(inherited)'"
    }
  else
    raise "Unknown deployment target: #{deployment_target}"
  end
end
