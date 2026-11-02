package net.artsy.app
import android.content.res.Configuration
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory

import android.app.Application
import android.content.Context
import android.graphics.Typeface
import android.graphics.fonts.Font
import android.graphics.fonts.FontFamily
import android.graphics.fonts.FontStyle
import android.os.Build
import android.util.Log
import com.braze.Braze
import com.braze.BrazeActivityLifecycleCallbackListener
import com.braze.support.BrazeLogger
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.segment.analytics.Analytics
import com.reactnativekeysjsi.KeysModule.getSecureFor

class MainApplication : Application(), ReactApplication {

    override val reactHost: ReactHost by lazy {
      ExpoReactHostFactory.getDefaultReactHost(
        context = applicationContext,
        packageList =
          PackageList(this).packages.apply {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // add(MyReactNativePackage())
            add(ArtsyNativePackage())
          },
      )
    }

    /**
     * Groups the four Unica77 faces (already copied into assets/fonts by scripts/setup/download-fonts)
     * into one "Unica77 LL" family so that asking for bold / italic / bold italic resolves to the real
     * Medium / Italic / MediumItalic files instead of a synthesised style. react-native-enriched-markdown
     * relies on this: MarkdownText styles strong/em with the family name plus a weight/style trait.
     * Medium is registered as weight 700 so a "bold" request lands on it.
     *
     * The FontFamily API is Android 10+. Older devices get the Regular face registered under the same
     * name, so text still renders in Unica with synthesised bold / italic.
     */
    private fun registerUnicaFontFamily() {
        val family = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                fun face(file: String, weight: Int, slant: Int) =
                    Font.Builder(assets, "fonts/$file").setWeight(weight).setSlant(slant).build()

                Typeface.CustomFallbackBuilder(
                    FontFamily.Builder(face("Unica77LL-Regular.otf", FontStyle.FONT_WEIGHT_NORMAL, FontStyle.FONT_SLANT_UPRIGHT))
                        .addFont(face("Unica77LL-Italic.otf", FontStyle.FONT_WEIGHT_NORMAL, FontStyle.FONT_SLANT_ITALIC))
                        .addFont(face("Unica77LL-Medium.otf", FontStyle.FONT_WEIGHT_BOLD, FontStyle.FONT_SLANT_UPRIGHT))
                        .addFont(face("Unica77LL-MediumItalic.otf", FontStyle.FONT_WEIGHT_BOLD, FontStyle.FONT_SLANT_ITALIC))
                        .build()
                ).build()
            } catch (e: Exception) {
                Log.w("MainApplication", "Could not build the Unica77 LL font family, falling back to Regular", e)
                null
            }
        } else {
            null
        }

        val typeface = family ?: Typeface.createFromAsset(assets, "fonts/Unica77LL-Regular.otf")
        ReactFontManager.getInstance().addCustomFont("Unica77 LL", typeface)
    }

    override fun onCreate() {
        super.onCreate()

        try {
          DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
        } catch (e: IllegalArgumentException) {
          DefaultNewArchitectureEntryPoint.releaseLevel = ReleaseLevel.STABLE
        }

        loadReactNative(this)

        registerUnicaFontFamily()

        ArtsyNativeModule.didLaunch(this.getSharedPreferences("launchConfig", MODE_PRIVATE))

        var segmentWriteKey: String = getSecureFor("SEGMENT_PRODUCTION_WRITE_KEY_ANDROID")
        if (BuildConfig.DEBUG) {
            segmentWriteKey = getSecureFor("SEGMENT_STAGING_WRITE_KEY_ANDROID")
        }

        val analytics = Analytics.Builder(this, segmentWriteKey).build()

        Analytics.setSingletonInstance(analytics)

        registerActivityLifecycleCallbacks(BrazeActivityLifecycleCallbackListener())
        ApplicationLifecycleDispatcher.onApplicationCreate(this)
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
      super.onConfigurationChanged(newConfig)
      ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
    }
}
