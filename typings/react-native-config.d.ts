import type { NativeConfig } from "react-native-config"

declare module "react-native-config" {
  interface NativeConfig {
    ARTSY_API_CLIENT_SECRET: string
    ARTSY_API_CLIENT_KEY: string
    ARTSY_FACEBOOK_APP_ID: string
    SEGMENT_PRODUCTION_WRITE_KEY_IOS: string
    SEGMENT_PRODUCTION_WRITE_KEY_ANDROID: string
    SEGMENT_STAGING_WRITE_KEY_IOS: string
    SEGMENT_STAGING_WRITE_KEY_ANDROID: string
    SENTRY_DSN: string
    GOOGLE_MAPS_API_KEY: string
    MAPBOX_API_CLIENT_KEY: string
    SAILTHRU_KEY: string
  }
}
