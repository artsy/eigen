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
# AGP 9's strict full mode no longer keeps the no-arg constructor implicitly, and Glide creates
# these modules by reflection, so keep it explicitly.
-keep public class * implements com.bumptech.glide.module.GlideModule { <init>(...); }
-keep public class * extends com.bumptech.glide.module.AppGlideModule { <init>(...); }
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# @stripe/stripe-react-native references the optional push-provisioning SDK
# (com.stripe:stripe-android-issuing-push-provisioning), which we don't depend on.
-dontwarn com.stripe.android.pushProvisioning.**

# Expo converts nested Records (e.g. expo-speech-recognition's volumeChangeEventOptions) with
# kotlin-reflect. Once R8 renames @Field and strips its Kotlin metadata, `Field.key` reads as null
# and the conversion throws a NullPointerException.
-keep class expo.modules.kotlin.records.Field { *; }
-keep class expo.modules.kotlin.records.Required { *; }
