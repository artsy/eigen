//
//  ARScreenPresenter.h
//  Artsy
//
//  Created by David Sheldrick on 26/08/2020.
//  Copyright © 2020 Artsy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>


NS_ASSUME_NONNULL_BEGIN

@interface ARScreenPresenterModule : NSObject <RCTBridgeModule>

+ (UIViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID skipBidFlow:(BOOL)skipBidFlow;

@end

NS_ASSUME_NONNULL_END
