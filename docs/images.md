# Images

Do you need to use an image?

At artsy we have several ways of retrieving an image.

Image urls are retrieved from metaphysics.

[This doc 🔐](https://www.notion.so/artsy/Handling-Images-On-The-Web-In-Force-5c6832bf4b3e431cb4830061ce057399), although web specific, provides some more context on how we handle images.

In general, our current **preferred practice** is to use the normalized image and resize it as necessary using on-the-fly resizing.

Images should always be at least 2x of the size we would anticipate to display them, since because of higher pixel densities as for example the latest iPhones have, high-resolution displays demand images with more pixels. You can read more about it [here](https://developer.apple.com/design/human-interface-guidelines/foundations/images/).

Here is an example query:

### I want a cropped image url

We have two ways of retrieving an image.
1x standard density
2x double density because of iPhone

iPhone currently has more pixels so we want to opt for 2x .
The way how we do this is to require

A graphQL query

```graphql
{
  show(id: "62dbddc6b70486000d2332bb") {
    images {
      square: cropped(height: 500, width: 500, version: "normalized") {
        url
      }
    }
  }
}
```

The same query in RN

```tsx
import { Dimensions } from "react-native"

const windowWidth = Number(Dimensions.get("window").width)

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

### Using the image inside an `<Image>` component

```tsx
//  assuming you iterate over images with i as an index
<Image source={{ uri: show.images[i].square.url }} />
```

## I want a full size image

if you want to use the full image size you can use the resized helper instead of cropped, and just supply the width, letting it figure out height itself, based on the original image dimensions:

```graphql
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

### Using the image inside an `<Image>` component

```tsx
// assuming you iterate over images with i as an index
<Image source={{ uri: show.images[i].resized.url }} />
```
