//
//  ARPermissions.h
//  Emission
//
//  Created by Brian Beckerle on 7/30/20.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARPermissions : NSObject <RCTBridgeModule>

@property (nonatomic, assign, readwrite) BOOL hasEnabledPushNotifications;

@end

NS_ASSUME_NONNULL_END
