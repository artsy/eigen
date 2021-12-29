//
//  ARUserTempStore.h
//  Artsy
//
//  Created by Brian Beckerle on 12/29/21.
//  Copyright © 2021 Artsy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "User.h"

NS_ASSUME_NONNULL_BEGIN

@interface ARUserTempStore : NSObject

@property (nonatomic, strong) User *user;
@property (nonatomic, strong) NSString *oAuthToken;
@property (nonatomic, strong) NSString *xAppToken;
@property (nonatomic, strong) NSArray<NSHTTPCookie *> *cookies;

+ (ARUserTempStore *)storeWithUser:(User *)user
                       oAuthToken:(NSString *)oAuthToken
                        xAppToken:(NSString *)xAppToken
                          cookies:(NSArray<NSHTTPCookie *> *)cookies;

@end

NS_ASSUME_NONNULL_END
