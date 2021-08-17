//
//  ARAppStatusModule.m
//  Emission
//
//  Created by Kizito Egeonu on 16.08.21.
//

#import "ARAppStatusModule.h"

@implementation ARAppStatusModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(isBeta: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject) {
    static BOOL isBeta = NO;
    static dispatch_once_t onceToken = 0;
    dispatch_once(&onceToken, ^{
        NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
        NSString *receiptURLString = [receiptURL path];
        isBeta = [receiptURLString rangeOfString:@"sandboxReceipt"].location != NSNotFound;

    });
    if (isBeta) {
        resolve(@YES);
    } else {
        resolve(@NO);
    }
}

@end
