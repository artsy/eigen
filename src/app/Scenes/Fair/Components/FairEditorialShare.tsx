import { Box, BoxProps, EnvelopeIcon, FacebookIcon, Touchable, TwitterIcon } from "palette"
import React from "react"
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
      onPress={() => {
        Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
      }}
    >
      <FacebookIcon title="Post this article to Facebook" mr={0.5} />
    </Touchable>

    <Touchable
      onPress={() => {
        Linking.openURL(`mailto:?subject=${subject}&amp;body=Check out ${subject} on Artsy: ${url}`)
      }}
    >
      <EnvelopeIcon title="Share this article via email" mr={0.5} />
    </Touchable>

    <Touchable
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
