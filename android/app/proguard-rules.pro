# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in the AGP default proguard-android-optimize.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep source file names and line numbers so Sentry can map obfuscated native frames back
# to readable stack traces via the uploaded R8 mapping file.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

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

# Fresco's animated-image backend is referenced but not bundled in this app.
-dontwarn com.facebook.imagepipeline.animated.factory.AnimatedFactoryImpl

# @stripe/stripe-react-native references the optional push-provisioning SDK
# (com.stripe:stripe-android-issuing-push-provisioning), which we don't depend on.
-dontwarn com.stripe.android.pushProvisioning.**

# Google Sign-In: R8 optimization can inline or rewrite the code that maps GoogleSignInAccount
# into the user object handed to JS (see react-native-google-signin/google-signin#1438).
-keep class com.reactnativegooglesignin.** { *; }
-keep class com.google.android.gms.auth.api.signin.** { *; }
