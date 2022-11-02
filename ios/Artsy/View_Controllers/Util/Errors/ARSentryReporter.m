//
//  ARSentryReporter.m
//  Artsy
//
//  Created by Brian Beckerle on 11/1/22.
//

#import "ARSentryReporter.h"
#import <Sentry/Sentry.h>

@implementation ARSentryReporter

+ (void)reportProblemForUserID:(NSString *)userID
                        inSale:(NSString *)saleID
               withDescription:(NSString *)description {
    NSError *auctionError = [NSError errorWithDomain:@"LiveSale" code:418 userInfo:@{ NSLocalizedDescriptionKey: @"User reported issue." }];
    [SentrySDK captureError:auctionError withScopeBlock:^(SentryScope * _Nonnull scope) {
        [scope setContextValue:@{
            @"sale-id" : saleID,
            @"sale-problem-description" : description,
            @"sale-user-id" : userID
        } forKey:@"sale-problem-report"];
    }];
}

@end
