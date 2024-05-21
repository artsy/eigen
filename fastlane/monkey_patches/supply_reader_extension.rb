# supply_reader_extension.rb

# See `Custom lane google_play_track_rollout_percentages in fastlane dir` in HACKS.md

require 'supply'

module Supply
  class Reader
    unless method_defined?(:track_rollout_percentages)
      def track_rollout_percentages
        track = Supply.config[:track]

        client.begin_edit(package_name: Supply.config[:package_name])
        releases = client.track_releases(track)
        rollout_percentages = releases.map do |release|
          {
            name: release.name,
            version_codes: release.version_codes.join(', '),
            user_fraction: release.user_fraction
          }
        end
        client.abort_current_edit

        rollout_percentages
      end
    end
  end
end
