import { ReadMore } from "app/Components/ReadMore"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { Text } from "palette"
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
    <React.Fragment key={key}>
      <Text>{title}</Text>

      {React.isValidElement(value) ? (
        value
      ) : (
        <ReadMore
          content={value as string}
          color="black60"
          textStyle="new"
          maxChars={truncatedTextLimit()}
          trackingFlow={tracking?.readMore?.flow}
          contextModule={tracking?.readMore?.contextModule}
        />
      )}
    </React.Fragment>
  )
}
