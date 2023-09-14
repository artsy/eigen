# Sentry related lanes and utilities

desc "Uploads sourcemaps, bundles and dsyms to sentry"
lane :upload_sentry_artifacts do |options|
  sentry_release_name = options[:sentry_release_name]
  platform = options[:platform]
  dist_version = options[:dist_version]
  sentry_cli_path="node_modules/@sentry/cli/bin/sentry-cli"

  project_slug = 'eigen'
  org_slug = 'artsynet'

  if sentry_release_name.nil?
    UI.user_error!("Sentry release version not specified")
  end

  if dist_version.nil?
    UI.user_error!("Sentry distribution version not specified")
  end

  settings = platform_settings(options[:platform])
  source_map_path = settings[:source_map_path]
  bundle_path = settings[:bundle_path]
  outfile = settings[:outfile]

  begin
    sentry_create_release(auth_token: ENV['SentryUploadAuthKey'],
      sentry_cli_path: sentry_cli_path,
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
        sentry_cli_path: sentry_cli_path
      )
    rescue StandardError => e
      message = 'Uploading dsyms to sentry failed.'
      handle_error(e, message)
    end
  end

  begin
    sentry_upload_sourcemap(auth_token: ENV['SentryUploadAuthKey'],
                            sentry_cli_path: sentry_cli_path,
                            org_slug: org_slug,
                            project_slug: project_slug,
                            version: sentry_release_name,
                            dist: dist_version,
                            sourcemap: [bundle_path, source_map_path],
                            rewrite: true)
    puts "Uploaded source js and js.map for #{project_slug}"
  rescue StandardError => e
    message = 'Uploading the JS bundle and/or sourcemap to Sentry failed. This sometimes happens when shipping many builds to Sentry.'
    handle_error(e, message)
  end
end

private_lane :upload_dsyms_to_sentry do |options|
  org_slug = options[:org_slug]
  project_slug = options[:project_slug]
  sentry_cli_path = options[:sentry_cli_path]

  # make individual dSYM archives available to the sentry-cli tool.
  root = File.expand_path('..', __dir__)
  dsym_archive = File.join(root, 'Artsy.app.dSYM.zip')
  dsyms_path = File.join(root, 'dSYMs')
  sh "unzip -d #{dsyms_path} #{dsym_archive}"

  Dir.glob(File.join(dsyms_path, '*.dSYM')).each do |dsym_path|
    # No need to specify `dist` as the build number is encoded in the dSYM's Info.plist
    sentry_upload_dsym(auth_token: ENV['SentryUploadAuthKey'],
                       sentry_cli_path: sentry_cli_path,
                       org_slug: org_slug,
                       project_slug: project_slug,
                       dsym_path: dsym_path)
    puts "Uploaded dsym for #{project_slug}"
  end
  sh "rm -rf #{dsyms_path}"
end

def platform_settings(platform)
  settings = {
    ios: {
      source_map_path: 'dist/main.jsbundle.map',
      bundle_path: 'dist/main.jsbundle'
    },
    android: {
      source_map_path: 'android/app/src/main/assets/index.android.bundle.map',
      bundle_path: 'android/app/src/main/assets/index.android.bundle'
    }
  }
  settings[platform.to_sym]
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
