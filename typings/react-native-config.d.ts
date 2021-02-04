import type { NativeConfig } from "react-native-config"

declare module "react-native-config" {
  interface NativeConfig {
    ARTSY_API_CLIENT_SECRET: string
    ARTSY_API_CLIENT_KEY: string
    ARTSY_FACEBOOK_APP_ID: string
    SEGMENT_PRODUCTION_WRITE_KEY: string
    SEGMENT_STAGING_WRITE_KEY: string
    SENTRY_PRODUCTION_DSN: string
    SENTRY_STAGING_DSN: string
    GOOGLE_MAPS_API_KEY: string
    MAPBOX_API_CLIENT_KEY: string
    SAILTHRU_KEY: string
  }
}
