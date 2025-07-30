# Sentry related lanes and utilities

desc "Uploads sourcemaps, bundles and dsyms to sentry"
lane :upload_sentry_artifacts do |options|
  sentry_release_name = options[:sentry_release_name]
  platform = options[:platform]
  dist_version = options[:dist_version]

  project_slug = 'eigen'
  org_slug = 'artsynet'

  if sentry_release_name.nil?
    UI.user_error!("Sentry release version not specified")
  end

  if dist_version.nil?
    UI.user_error!("Sentry distribution version not specified")
  end

  settings = platform_settings(options[:platform])
  sourcemap_path = settings[:sourcemap_path]
  bundle_path = settings[:bundle_path]
  outfile = settings[:outfile]

  begin
    sentry_create_release(auth_token: ENV['SENTRY_UPLOAD_AUTH_KEY'],
      org_slug: org_slug,
      project_slug: project_slug,
      version: sentry_release_name,
      finalize: false)
  rescue StandardError => e
    message = 'Creating release for sentry failed. This can happen if sentry cli is out of date.'
    handle_error(e, message)
  end

  puts "Created a release for #{project_slug}"

  if platform == "ios"
    begin
      upload_dsyms_to_sentry(
        org_slug: org_slug,
        project_slug: project_slug,
      )
    rescue StandardError => e
      message = 'Uploading dsyms to sentry failed.'
      handle_error(e, message)
    end
  end

  upload_sentry_sourcemaps(
    org_slug: org_slug,
    project_slug: project_slug,
    sentry_release_name: sentry_release_name,
    dist: dist_version,
    bundle_path: bundle_path,
    sourcemap_path: sourcemap_path,
  )
end

lane :upload_sentry_sourcemaps do |options|
  org_slug = options[:org_slug]
  project_slug = options[:project_slug]
  sentry_release_name = options[:sentry_release_name]
  dist = options[:dist]
  bundle_path = options[:bundle_path]
  sourcemap_path = options[:sourcemap_path]
  silence_failures = options[:silence_failures]

  begin
    sentry_upload_sourcemap(
      auth_token: ENV['SENTRY_UPLOAD_AUTH_KEY'],
      org_slug: org_slug,
      project_slug: project_slug,
      version: sentry_release_name,
      dist: dist,
      sourcemap: [bundle_path, sourcemap_path],
      rewrite: true
    )
    puts "Uploaded source js and js.map for #{project_slug}"
  rescue StandardError => e
    message = 'Uploading the JS bundle and/or sourcemap to Sentry failed. This sometimes happens when shipping many builds to Sentry.'
    if !silence_failures
      handle_error(e, message)
    end
  end
end

private_lane :upload_dsyms_to_sentry do |options|
  org_slug = options[:org_slug]
  project_slug = options[:project_slug]

  # make individual dSYM archives available
  root = File.expand_path('..', __dir__)
  dsym_archive = File.join(root, 'Artsy.app.dSYM.zip')
  dsyms_path = File.join(root, 'dSYMs')
  sh "unzip -d #{dsyms_path} #{dsym_archive}"

  Dir.glob(File.join(dsyms_path, '*.dSYM')).each do |dsym_path|
    # No need to specify `dist` as the build number is encoded in the dSYM's Info.plist
    sentry_debug_files_upload(
      auth_token: ENV['SENTRY_UPLOAD_AUTH_KEY'],
      org_slug: org_slug,
      project_slug: project_slug,
      path: dsym_path
    )

    puts "Uploaded dsym for #{project_slug}"
  end
  sh "rm -rf #{dsyms_path}"
end

def platform_settings(platform)
  settings = {
    ios: {
      sourcemap_path: 'dist/ios/main.jsbundle.map',
      bundle_path: 'dist/ios/main.jsbundle'
    },
    android: {
      sourcemap_path: 'android/app/build/generated/sourcemaps/react/release/index.android.bundle.map',
      bundle_path: 'android/app/build/generated/assets/createBundleReleaseJsAndAssets/index.android.bundle'
    }
  }
  settings[platform.to_sym]
end

lane :sentry_slack_ios do |options|
  build_number = options[:build_number]
  version = options[:version]

  sentry_url = "https://artsynet.sentry.io/releases/ios-#{version}-#{build_number}/?environment=production&project=5867225"
  message = <<~MSG
                :apple: :iphone: :tada:
                iOS #{version} (#{build_number}) was submitted to the app store!
                Monitor [here](#{sentry_url})
              MSG

  puts message
  slack(
    message: message,
    success: true,
    default_payloads: []
  )
end

lane :sentry_slack_android do |options|
  build_number = options[:build_number]
  version = options[:version]

  sentry_url = "https://artsynet.sentry.io/releases/android-#{version}-#{build_number}/?environment=production&project=5867225"
  message = <<~MSG
                :android-2: :tada:
                Android #{version} (#{build_number}) was submitted to the app store!
                Monitor [here](#{sentry_url})
              MSG

  puts message
  slack(
    message: message,
    success: true,
    default_payloads: []
  )
end

def extract_ios_bundle_and_sourcemap(archive_root: "../archives", dist_dir: "../dist/ios", app_name: "Artsy")
  # Find latest archive
  pattern = File.join(archive_root, "#{app_name}*.xcarchive")
  matching_archives = Dir.glob(pattern)

  unless matching_archives.any?
    UI.user_error!("No .xcarchive found matching pattern #{pattern}")
  end

  latest_archive = matching_archives.max_by { |f| File.mtime(f) }
  puts "Found archive at: #{latest_archive}"

  app_path = File.join(latest_archive, "Products/Applications/#{app_name}.app")
  bundle_path = File.join(app_path, "main.jsbundle")
  sourcemap_source = File.expand_path("../main.jsbundle.map", __dir__) # project root relative to Fastfile
  dist_dir = File.expand_path(dist_dir, __dir__)

  unless File.exist?(bundle_path)
    UI.user_error!("main.jsbundle not found at #{bundle_path}")
  end

  unless File.exist?(sourcemap_source)
    UI.user_error!("main.jsbundle.map not found at #{sourcemap_source}")
  end

  FileUtils.mkdir_p(dist_dir)
  FileUtils.cp(bundle_path, File.join(dist_dir, "main.jsbundle"))
  FileUtils.cp(sourcemap_source, File.join(dist_dir, "main.jsbundle.map"))

  UI.success("✅ Successfully copied iOS bundle and sourcemap to #{dist_dir}/")
end

def handle_error(e, message)
  if is_ci
    slack(
      message: message,
      success: false,
      payload: {
        'Circle Build' => ENV['CIRCLE_BUILD_URL'],
        'Exception' => e.message
      },
      default_payloads: [:last_git_commit_hash]
    )
  end
  UI.error(message)
  UI.error(e.message)
  UI.message(e.backtrace.join("\n\t"))
end
