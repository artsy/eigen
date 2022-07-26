# Images

Do you need to use an image?

At artsy we have several ways of retrieving an image.

Images are stored in metaphysics.

In general, our current preferred practice is to use the normalized image and resize it as necessary using on-the-fly resizing.

Here is an example query:

```
{
  show(id: "62dbddc6b70486000d2332bb") {
    images(default: true) {
      url(version: "normalized")
      cropped(height: 500, width: 500, version: "normalized") {
        url
      }

      resized(height: 500, version: "normalized") {
        url
      }
    }
  }
}
```

This doc [here](https://www.notion.so/artsy/Handling-Images-On-The-Web-In-Force-5c6832bf4b3e431cb4830061ce057399) is web specific but provides some more context on how we handle images.
