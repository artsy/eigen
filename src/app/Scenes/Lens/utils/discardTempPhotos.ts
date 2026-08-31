import { File } from "expo-file-system"

/**
 * Deletes temp photo files the Lens flow wrote itself -- each search leaves a full-resolution
 * capture and a cropped JPEG behind, and nothing else in the app prunes them.
 *
 * Only pass URIs the flow *created*. Never a library-picked photo's: below Android API 29,
 * `react-native-image-crop-picker`'s `resolveRealPath` can hand back a real path into external
 * storage, so deleting one could destroy the user's actual photo. The picker owns those, and
 * exposes `ImagePicker.clean()`.
 *
 * Best effort: a file we can't remove is a stale temp file the OS clears anyway, not a broken
 * search, so failures aren't worth surfacing.
 */
export const discardTempPhotos = (uris: string[]) => {
  for (const uri of uris) {
    try {
      const file = new File(uri)

      if (file.exists) {
        file.delete()
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("discardTempPhotos: could not delete", uri, error)
      }
    }
  }
}
