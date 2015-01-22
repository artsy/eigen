### Troubleshooting
##### Orta Therox - Wed 4 Sep 2013

### CocoaPods
If a pod complains about not finding `/Developer`, you may need to update your location for Xcode. You can check which version your computer thinks is the latest by running `xcode-select -p` if it's not what you expect:

```
# Note that you are referencing the Xcode bundle you want to use.
sudo xcode-select -switch /Applications/Xcode5-DP6.app/Contents/Developer
```

If you have run `pod install` in the past, you may need to update:
```
pod update
```
