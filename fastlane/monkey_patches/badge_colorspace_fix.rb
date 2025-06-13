# badge_colorspace_fix.rb

# Fix for badge gem colorspace issues when generating badges
# Adds sRGB colorspace specification to prevent color distortion

require 'badge'

module Badge
  class Runner
    alias_method :original_composite, :composite

    def composite(image, overlay, alpha_channel, gravity, geometry = nil)
      image.composite(overlay, 'png') do |c|
        c.compose "Over"
        c.alpha 'On' unless !alpha_channel
        c.colorspace 'sRGB'
        c.gravity gravity
        c.geometry geometry if geometry
      end
    end
  end
end