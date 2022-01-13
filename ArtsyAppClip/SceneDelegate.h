//
//  SceneDelegate.h
//  ArtsyAppClip
//
//  Created by Adam Butler on 12.01.22.
//  Copyright © 2022 Artsy. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>

@property (strong, nonatomic) UIWindow * window;
@property (strong, readwrite) NSString * initialLinkUrl;


@end

