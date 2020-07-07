//
//  ARTabType.h
//  Artsy
//
//  Created by David Sheldrick on 06/07/2020.
//  Copyright © 2020 Artsy. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARTabType : NSObject
// This file must match "BottomTabType.ts"
+(NSString *)home;
+(NSString *)search;
+(NSString *)inbox;
+(NSString *)sell;
+(NSString *)profile;
@end

NS_ASSUME_NONNULL_END
