import {
  FacebookIcon,
  EnvelopeIcon,
  TwitterIcon,
  Box,
  BoxProps,
  Touchable,
} from "@artsy/palette-mobile"
import { Linking } from "react-native"

interface FairEditorialShareProps extends BoxProps {
  subject: string
  url: string
}

export const FairEditorialShare: React.FC<FairEditorialShareProps> = ({
  subject,
  url,
  ...rest
}) => (
  <Box display="flex" flexDirection="row" alignItems="center" {...rest}>
    <Touchable
      accessibilityRole="button"
      accessibilityLabel="Share this article on Facebook"
      onPress={() => {
        Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
      }}
    >
      <FacebookIcon title="Post this article to Facebook" mr={0.5} />
    </Touchable>

    <Touchable
      accessibilityRole="button"
      accessibilityLabel="Share this article via email"
      onPress={() => {
        Linking.openURL(`mailto:?subject=${subject}&amp;body=Check out ${subject} on Artsy: ${url}`)
      }}
    >
      <EnvelopeIcon title="Share this article via email" mr={0.5} />
    </Touchable>

    <Touchable
      accessibilityRole="button"
      accessibilityLabel="Share this article on X"
      onPress={() => {
        Linking.openURL(
          `https://twitter.com/intent/tweet?original_referer=${url}&amp;text=${subject}&amp;url=${url}&amp;via=artsy`
        )
      }}
    >
      <TwitterIcon title="Share this article on Twitter" />
    </Touchable>
  </Box>
)
