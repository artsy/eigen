//    MIT License
//
//    Copyright (c) 2018 Gaspard+Bruno
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy
//    of this software and associated documentation files (the "Software"), to deal
//    in the Software without restriction, including without limitation the rights
//    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//    copies of the Software, and to permit persons to whom the Software is
//    furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all
//    copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//    SOFTWARE.
//
//    https://github.com/Gaspard-Bruno/react-native-static-safe-area-insets

#import "RNStaticSafeAreaInsets.h"
#import <UIKit/UIKit.h>

@implementation RNStaticSafeAreaInsets

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSDictionary *)constantsToExport
{
    if (@available(iOS 11.0, *)) {
        return @{
                 @"top": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.top),
                 @"bottom": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.bottom),
                 @"left": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.left),
                 @"right": @(UIApplication.sharedApplication.keyWindow.safeAreaInsets.right)
                 };
    } else {
        return @{
                 @"top": @(0),
                 @"bottom": @(0),
                 @"left": @(0),
                 @"right": @(0),
                 };
    }
}

@end
