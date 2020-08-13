import React from "react"
import {
  BaseImage,
  BaseResponsiveImage,
  ImageProps,
  ResponsiveImageProps,
} from "./Image.shared"
import { LazyImage } from "./LazyImage"

/** Props for a web-only Image component. */
export interface WebImageProps extends ImageProps {
  /** Flag for if image should be lazy loaded */
  lazyLoad?: boolean
  /** Alternate text for image */
  alt?: string
  /** A11y text label */
  ["aria-label"]?: string
  /** The title of the image */
  title?: string
  /** Flag indicating that right clicks should be prevented */
  preventRightClick?: boolean
}

/** A web-only Image component. */
export const Image = ({
  lazyLoad = false,
  preventRightClick = false,
  ...props
}: WebImageProps) => {
  return (
    <LazyImage
      preload={!lazyLoad}
      imageComponent={BaseImage}
      {...props}
      onContextMenu={e => preventRightClick && e.preventDefault()}
    />
  )
}

/** Props for a web-only ResponsiveImage component. */
export interface WebResponsiveImageProps extends ResponsiveImageProps {
  /** Flag for if image should be lazy loaded */
  lazyLoad?: boolean
}

/** A web-only ResponsiveImage component. */
export const ResponsiveImage = ({
  lazyLoad = false,
  ...props
}: WebResponsiveImageProps) => (
  <LazyImage
    preload={!lazyLoad}
    imageComponent={BaseResponsiveImage}
    {...props}
  />
)

export { LazyImage }
