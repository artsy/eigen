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

  build_type = options[:build_type] || 'release'
  settings = platform_settings(options[:platform], build_type: build_type)
  sourcemap_path = settings[:sourcemap_path]
  bundle_path = settings[:bundle_path]
  outfile = settings[:outfile]

  begin
    sentry_create_release(auth_token: ENV['SENTRY_AUTH_TOKEN'],
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
      auth_token: ENV['SENTRY_AUTH_TOKEN'],
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

lane :upload_dsyms_to_sentry do |options|
  org_slug = options[:org_slug]
  project_slug = options[:project_slug]

   sentry_debug_files_upload(
      auth_token: ENV['SENTRY_AUTH_TOKEN'],
      org_slug: org_slug,
      project_slug: project_slug,
      include_sources: true
    )

  puts "Uploaded dsyms for #{project_slug}"

  upload_prebuilt_framework_debug_files_to_sentry(org_slug: org_slug, project_slug: project_slug)
end

# Uploads debug information for React Native's prebuilt xcframeworks.
#
# Three of these ship as vendored binaries rather than being compiled from source:
#   - `hermesvm.xcframework` - prebuilt Hermes VM, since RN 0.83 / Expo 55
#   - `React.xcframework` and `ReactNativeDependencies.xcframework` - since RN 0.84, which
#     made precompiled React Native core the default on iOS (`RCT_USE_PREBUILT_RNCORE=1`)
#
# Xcode copies these vendored binaries into the app as-is and never generates dSYMs for them,
# the pods ship none, and none end up in the archive's dSYMs folder — so the default dSYM
# upload above misses them entirely and native frames from these images show up in Sentry as
# `Image React` / `ReactNativeDependencies` / `hermesvm` -> Missing.
#
# The prebuilt binaries are not stripped (`sentry-cli debug-files check` reports
# `symtab, unwind` and `Usable: yes`), so sentry-cli can read the symbols straight from the
# Mach-O. We point it at the device (`ios-arm64`) slice explicitly.
#
# Rebuild/re-check this list whenever React Native changes how it vendors prebuilt binaries.
def upload_prebuilt_framework_debug_files_to_sentry(options = {})
  org_slug = options[:org_slug]
  project_slug = options[:project_slug]

  pods_root = File.expand_path('../ios/Pods', __dir__)

  expected_frameworks = [
    "#{pods_root}/React-Core-prebuilt/React.xcframework/ios-arm64/React.framework",
    "#{pods_root}/ReactNativeDependencies/framework/packages/react-native/ReactNativeDependencies.xcframework/ios-arm64/ReactNativeDependencies.framework",
    "#{pods_root}/hermes-engine/destroot/Library/Frameworks/universal/hermesvm.xcframework/ios-arm64/hermesvm.framework"
  ]

  paths = expected_frameworks.select { |path| File.exist?(path) }

  (expected_frameworks - paths).each do |missing|
    UI.important("Prebuilt framework not found at #{missing} - skipping it; native frames from that image will be unsymbolicated in Sentry")
  end

  if paths.empty?
    UI.important('No prebuilt React Native frameworks found - skipping prebuilt debug files upload')
    return
  end

  begin
    sentry_debug_files_upload(
      auth_token: ENV['SENTRY_AUTH_TOKEN'],
      org_slug: org_slug,
      project_slug: project_slug,
      path: paths
    )
    puts "Uploaded prebuilt framework debug files (#{paths.map { |path| File.basename(path) }.join(', ')}) for #{project_slug}"
  rescue StandardError => e
    handle_error(e, 'Uploading prebuilt React Native framework debug files to Sentry failed.')
  end
end

def platform_settings(platform, build_type: 'release')
  settings = {
    ios: {
      sourcemap_path: 'dist/ios/main.jsbundle.map',
      bundle_path: 'dist/ios/main.jsbundle'
    },
    android: {
      sourcemap_path: "android/app/build/generated/sourcemaps/react/#{build_type}/index.android.bundle.map",
      bundle_path: "android/app/build/generated/assets/react/#{build_type}/index.android.bundle"
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
