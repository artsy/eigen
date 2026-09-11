# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# needed for hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }


# These changes are related to react-native-fast-image
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
# @generated begin expo-build-properties - expo prebuild (DO NOT MODIFY)
# Fresco's animated-image backend is referenced but not bundled in this app.
-dontwarn com.facebook.imagepipeline.animated.factory.AnimatedFactoryImpl

# @stripe/stripe-react-native references the optional push-provisioning SDK
# (com.stripe:stripe-android-issuing-push-provisioning), which we don't depend on.
-dontwarn com.stripe.android.pushProvisioning.**
# @generated end expo-build-properties