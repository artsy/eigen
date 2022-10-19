import { ReadMore } from "app/Components/ReadMore"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { Box, Flex, Spacer, Text } from "palette"
import React from "react"

interface Tracking {
  flow: Schema.Flow
  contextModule: Schema.ContextModules
}
interface ArtworkDetailsRowProps {
  key: string
  title: string
  value: string | React.ReactElement | null | undefined
  tracking?: {
    readMore?: Tracking
  }
}

export const ArtworkDetailsRow: React.FC<ArtworkDetailsRowProps> = ({
  key,
  title,
  value,
  tracking,
}) => {
  return (
    <Flex flexDirection="row" key={key}>
      <Box flex={1} maxWidth="128">
        <Text variant="sm" color="black60">
          {title}
        </Text>
      </Box>
      <Spacer mr={2} />
      <Box flex={1} justifyContent="center">
        {React.isValidElement(value) ? (
          value
        ) : (
          <ReadMore
            content={value as string}
            color="black100"
            textStyle="new"
            maxChars={truncatedTextLimit()}
            trackingFlow={tracking?.readMore?.flow}
            contextModule={tracking?.readMore?.contextModule}
            textVariant="sm"
          />
        )}
      </Box>
    </Flex>
  )
}
