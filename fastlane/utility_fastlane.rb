# Utility functions

desc "Updates the version string in app.json"
lane :update_version_string do |options|
  new_version = options[:version] || prompt(text: "What is the new human-readable release version?")
  $APP_JSON['version'] = new_version
  write_contents_to_file($APP_JSON_PATH, JSON.pretty_generate($APP_JSON))
end

desc "Checks app store connect if a license agreement needs to be signed"
lane :notify_if_new_license_agreement do
  # TODO: This login method will no longer work for CI with 2fa being enforced
  # Check spaceship docs for future support with api key
  client = Spaceship::Tunes.login(ENV['FASTLANE_USERNAME'], ENV['FASTLANE_PASSWORD'])
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

desc "Notifies in slack if a beta failed to deploy"
lane :notify_beta_failed do |options|
  exception = options[:exception]
  message = <<~MSG
              :x: :iphone:
              Looks like the latest beta failed to deploy!
              See circle job for more details.
            MSG
  slack(
    message: message,
    success: false,
    payload: {
      'Circle Build' => ENV['CIRCLE_BUILD_URL'],
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

lane :tag_and_push do |options|
  # Do a tag, we use a http git remote so we can have push access
  # as the default remote for circle is read-only
  tag = options[:tag]
  `git tag -d "#{tag}"`
  add_git_tag tag: tag
  `git remote add http https://github.com/artsy/eigen.git || true`
  `git push http #{tag} -f`
end

lane :test_version_update_pr do
  update_version_string(version: '8.40.0')
  prepare_version_update_pr(commit_message: "chore: prepare for next release")
end

desc "Prepares a new branch with version changes, pushes it, and creates a PR"
lane :prepare_version_update_pr do |options|
  version_change_branch = "version-update-#{Time.now.strftime('%Y%m%d%H%M%S')}"
  commit_message = options[:commit_message]

  sh "git add ."
  sh "git commit -m '#{commit_message} --no-verify'"

  sh "git remote add http https://github.com/artsy/eigen.git || true"  # '|| true' to ignore errors if remote already exists

  # Create the new branch in remote and push changes
  sh "git push origin HEAD:refs/heads/#{version_change_branch}"

  create_pull_request(
    api_token: ENV["CHANGELOG_GITHUB_TOKEN_KEY"],
    repo: "artsy/eigen",
    title: commit_message,
    head: version_change_branch,
    assignees: ["mobile-platform", "brainbicycle"],
    base: "main",
    body: "This PR updates the app version to prepare for next release."
  )
end

lane :check_flags do
  sh('yarn check-flags')
  flag_file = File.read('./flags.json')
  flags = JSON.parse(flag_file)
  hidden_flags = flags['hiddenFlags']

  hidden_flags_message = ''
  hidden_flags.each do |flag_name|
    hidden_flags_message += "\n :x: #{flag_name}"
  end

  message = <<~MSG
    :checkered_flag: :steam_locomotive:
    We are getting ready for an app release!
    Are your features ready?
    *Features HIDDEN in the upcoming release*:
    #{hidden_flags_message}
    If a feature here should be going out this release please follow the docs here
    ahead of release QA:
    https://github.com/artsy/eigen/blob/main/docs/developing_a_feature.md#releasing-a-feature
    @onyx-devs @phires @amber-devs @diamond-devs @emerald-devs
  MSG
  slack(message: message, default_payloads: [], link_names: true)
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
