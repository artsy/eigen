import { Platform } from "react-native"

/**
 * react-native-blurhash emits its RN load events from the background decode queue when
 * decodeAsync is on. On iOS those land in the main-thread-only, view-manager-wide legacy
 * interop event map, so concurrent decodes can race it and crash (EIGEN-AZBJ). Decode
 * synchronously on iOS until that is fixed upstream; Android is unaffected.
 *
 * Decodes are 16x16, so the synchronous cost is negligible.
 */
export const BLURHASH_DECODE_ASYNC = Platform.OS !== "ios"
