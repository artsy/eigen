import { ReadMore } from "lib/Components/ReadMore"
import { truncatedTextLimit } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { Sans } from "palette"
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

export const ArtworkDetailsRow: React.FC<ArtworkDetailsRowProps> = ({ key, title, value, tracking }) => {
  return (
    <React.Fragment key={key}>
      <Sans size="3t" weight="regular">
        {title}
      </Sans>
      {React.isValidElement(value) ? (
        value
      ) : (
        <ReadMore
          content={value as string}
          color="black60"
          textStyle="sans"
          maxChars={truncatedTextLimit()}
          trackingFlow={tracking?.readMore?.flow}
          contextModule={tracking?.readMore?.contextModule}
        />
      )}
    </React.Fragment>
  )
}
