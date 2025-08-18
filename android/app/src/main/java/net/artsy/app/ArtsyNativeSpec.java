package net.artsy.app;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

import java.util.Map;

public abstract class ArtsyNativeSpec extends ReactContextBaseJavaModule implements TurboModule {

    public ArtsyNativeSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public abstract void setNavigationBarColor(String color);

    @ReactMethod
    public abstract void setAppStyling(Promise promise);

    @ReactMethod
    public abstract void setAppLightContrast(Boolean isLight, Promise promise);

    @ReactMethod
    public abstract void setStatusBarColor(String color);

    @ReactMethod
    public abstract void lockActivityScreenOrientation();

    @ReactMethod
    public abstract void clearCache(Promise promise);

    public abstract Map<String, Object> getConstants();
}