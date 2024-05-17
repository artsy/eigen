module Supply
  class Options
    class << self
      alias_method :original_available_options, :available_options

      def available_options
        original_options = original_available_options
        custom_options = [
          FastlaneCore::ConfigItem.new(
            key: :use_custom_promotion_logic,
            env_name: "SUPPLY_USE_CUSTOM_PROMOTION_LOGIC",
            description: "If set to true, uses custom logic for promoting tracks",
            type: Boolean,
            default_value: false,
            optional: true
          ),
          FastlaneCore::ConfigItem.new(
            key: :skip_release_verification,
            env_name: "SUPPLY_SKIP_RELEASE_VERIFICATION",
            description: "If set to true, skips checking if the version code exists in the track before promoting",
            type: Boolean,
            default_value: false,
            optional: true
          )
        ]

         # Only add custom options if they aren't already present
        custom_options.each do |custom_option|
          unless original_options.any? { |option| option.key == custom_option.key }
            original_options << custom_option
          end
        end

        original_options
      end
    end
  end
end
