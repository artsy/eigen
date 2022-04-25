import "react-native-config"

declare module "react-native-config" {
  interface NativeConfig {
    ARTSY_API_CLIENT_KEY: string
    ARTSY_API_CLIENT_SECRET: string
    ARTSY_FACEBOOK_APP_ID: string
    GOOGLE_MAPS_API_KEY: string
    MAPBOX_API_CLIENT_KEY: string
    SEGMENT_PRODUCTION_WRITE_KEY_ANDROID: string
    SEGMENT_PRODUCTION_WRITE_KEY_IOS: string
    SEGMENT_STAGING_WRITE_KEY_ANDROID: string
    SEGMENT_STAGING_WRITE_KEY_IOS: string
    SENTRY_DSN: string
    UNLEASH_PROXY_CLIENT_KEY_PRODUCTION: string
    UNLEASH_PROXY_CLIENT_KEY_STAGING: string
    UNLEASH_PROXY_URL_PRODUCTION: string
    UNLEASH_PROXY_URL_STAGING: string
  }
}
