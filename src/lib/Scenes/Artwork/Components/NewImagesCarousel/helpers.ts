export interface Size {
  width: number
  height: number
}

export interface Position {
  x: number
  y: number
}

/**
 * Represents geometric data to position images on the carousel rail
 */
interface ImageMeasurements {
  width: number
  height: number
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number
  cumulativeScrollOffset: number
}

const MIN_MARGIN = 20

// given an input array of image sources, calculates the dimensions and positions of all the images on the carousel
// rail. boundingBox is the maximum possible size that an image can occupy on the rail
export function getMeasurements({ images, boundingBox }: { images: ReadonlyArray<Size>; boundingBox: Size }) {
  const result: ImageMeasurements[] = []

  for (let i = 0; i < images.length; i++) {
    const { width, height, marginHorizontal, marginVertical } = fitInside(boundingBox, images[i])

    // collapse adjacent margins to avoid excess white space between images
    const marginLeft = i === 0 ? marginHorizontal : Math.max(marginHorizontal - result[i - 1].marginRight, 0)

    // make sure there's at least 20px between images
    const paddingLeft = i === 0 ? 0 : Math.max(0, MIN_MARGIN - marginLeft)

    // calculate cumulative scroll offset taking collapsed margins into account
    const cumulativeScrollOffset =
      i === 0 ? 0 : result[i - 1].cumulativeScrollOffset + boundingBox.width - (marginHorizontal - marginLeft)

    result.push({
      width,
      height,
      marginLeft: marginLeft + paddingLeft,
      marginRight: marginHorizontal,
      marginTop: marginVertical,
      marginBottom: marginVertical,
      cumulativeScrollOffset: cumulativeScrollOffset + paddingLeft,
    })
  }

  return result
}

// places a box (child) in the center of another (container), making the child 'fit' within the container
// without overflowing or changing the child's aspect ratio
export function fitInside(container: Size, child: Size): Size & { marginHorizontal: number; marginVertical: number } {
  const aspectRatio = child.width / child.height

  // start out assuming that we need to constrain the image by height
  let height = Math.min(container.height, child.height)
  let width = aspectRatio * height

  // check whether we actually need to constrain the image by width
  if (width > container.width) {
    width = container.width
    height = width / aspectRatio
  }

  // calculate centering margins
  const marginHorizontal = (container.width - width) / 2
  const marginVertical = (container.height - height) / 2

  return { width, height, marginHorizontal, marginVertical }
}

const imageVersionsSortedBySize = ["normalized", "larger", "large", "medium", "small"] as const

// we used to rely on there being a "normalized" version of every image, but that
// turns out not to be the case, so in those rare situations we order the image versions
// by size and pick the largest avaialable. These large images will then be resized by
// gemini for the actual thumbnail we fetch.
export function getBestImageVersionForThumbnail(imageVersions: readonly string[]) {
  for (const size of imageVersionsSortedBySize) {
    if (imageVersions.includes(size)) {
      return size
    }
  }

  if (!__DEV__) {
    console.log("No appropriate image size found for artwork (see breadcrumbs for artwork slug)")
  } else {
    console.warn("No appropriate image size found!")
  }

  // doesn't really matter what we return here, the gemini image url
  // will fail to load and we'll see a gray square. I haven't come accross an image
  // that this will happen for, but better safe than sorry.
  return "normalized"
}
