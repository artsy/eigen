# Images

Do you need to use an image?

Images should be retrieved at least 2x of the size we would anticipate to display them. This is because of higher pixel densities as for example the latest iPhones have, high-resolution displays demand images with more pixels. You can read more about it [here](https://developer.apple.com/design/human-interface-guidelines/foundations/images/).

Image urls are retrieved from metaphysics. We have several ways of doing that.

[This doc](https://www.notion.so/artsy/Handling-Images-On-The-Web-In-Force-5c6832bf4b3e431cb4830061ce057399), although web specific, provides some more context on how we handle images.

In general, our current **preferred practice** is to use the normalized image and resize it as necessary using on-the-fly resizing.

Here is an example query:

### I want a cropped image url

Getting a cropped image of dimensions 1000x1000.

This is a graphQL query you can try out at GraphiQL:

```
{
	show(id: "62dbddc6b70486000d2332bb") {
    images {
      square: cropped(height: 1000, width: 1000, version: "normalized") {
        url
      }
    }
  }
}

```

The same query in RN would be something like this:

```
import { Dimensions } from "react-native"

const windowWidth = Number(Dimensions.get("window").width)

const installsData = useLazyLoadQuery<ShowInstallsQuery>
(
  showInstallsQuery,
  {
    slug,
    imageSize: 2 * windowWidth,
  }
)

const showInstallsQuery = graphql`
  query ShowInstallsQuery($slug: String!, $imageSize: Int!) {
    show(id: $slug) {
      images(default: true) {
        internalID
        square: cropped(height: $imageSize, width: $imageSize, version: "normalized") {
          url
        }
      }
    }
  }
`
```

### Using the image inside an <Image> component

```
# assuming you iterate over images with i as an index
<Image source={{uri:show.images[0].square.url}} />
```

## I want a full size image

if you want to use the full image size you can use the resized helper instead of cropped, and just supply the width, letting it figure out height itself, based on the original image dimensions:

```
{
	show(id: "62dbddc6b70486000d2332bb") {
    images {
      resized(height: 500, version: "normalized") {
        url
      }
    }
  }
}

```

### Using the image inside an <Image> component

```
# assuming you iterate over images with i as an index
<Image source={{uri:show.images[i].resized.url}} />
```
