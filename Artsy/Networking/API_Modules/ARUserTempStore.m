//
//  ARUserTempStore.m
//  Artsy
//
//  Created by Brian Beckerle on 12/29/21.
//  Copyright © 2021 Artsy. All rights reserved.
//

#import "ARUserTempStore.h"


@implementation ARUserTempStore

+ (ARUserTempStore *)storeWithUser:(User *)user
                       oAuthToken:(NSString *)oAuthToken
                        xAppToken:(NSString *)xAppToken
                          cookies:(NSArray<NSHTTPCookie *> *)cookies
{
    ARUserTempStore *store = [ARUserTempStore new];
    store.user = user;
    store.oAuthToken = oAuthToken;
    store.xAppToken = xAppToken;
    store.cookies = cookies;
    return store;
}


@end
