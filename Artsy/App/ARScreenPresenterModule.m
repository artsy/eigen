//
//  ARScreenPresenter.m
//  Artsy
//
//  Created by David Sheldrick on 26/08/2020.
//  Copyright © 2020 Artsy. All rights reserved.
//

#import "ARScreenPresenterModule.h"
#import "ARTopMenuViewController.h"
#import <Emission/ARComponentViewController.h>
#import "UIDevice-Hardware.h"
#import "ARAdminSettingsViewController.h"
#import "ARSwitchBoard+Eigen.h"
#import "AROptions.h"
#import "ARSerifNavigationViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "Artsy-Swift.h"
#import "AREigenMapContainerViewController.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

@implementation ARScreenPresenterModule
RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue;
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(presentNativeScreen:(nonnull NSString *)moduleName props:(nonnull NSDictionary *)props  modal:(BOOL)modal)
{
    UIModalPresentationStyle modalPresentationStyle = modal ? UIModalPresentationPageSheet : -1;
    // This if .. else chain should match the `NativeModuleName` type in AppRegistry.tsx
    UIViewController *vc = nil;
    if ([moduleName isEqualToString:@"Admin"]) {
        vc = [[ARAdminSettingsViewController alloc] initWithStyle:UITableViewStyleGrouped];
    } else if ([moduleName isEqualToString:@"AuctionRegistration"]) {
        vc = [[ARSwitchBoard sharedInstance] loadAuctionRegistrationWithID:props[@"id"] skipBidFlow:[props[@"skip_bid_flow"] boolValue]];
    } else if ([moduleName isEqualToString:@"loadBidUIForArtwork"]) {
        vc = [[ARSwitchBoard sharedInstance] loadBidUIForArtwork:props[@"artwork_id"] inSale:props[@"id"]];
    } else if ([moduleName isEqualToString:@"LiveAuction"]) {
        if ([AROptions boolForOption:AROptionsDisableNativeLiveAuctions]) {
            vc = [[ARSerifNavigationViewController alloc]  initWithRootViewController:[[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:props[@"url"]]]];
        } else {
            NSString *path = [NSURL URLWithString:props[@"url"]].path;
            NSString *slug = [[path split:@"/"] lastObject];
            vc = [[LiveAuctionViewController alloc] initWithSaleSlugOrID:slug];
        }
        modalPresentationStyle = UIModalPresentationFullScreen;
    } else if ([moduleName isEqualToString:@"LocalDiscovery"]) {
        vc = [[AREigenMapContainerViewController alloc] init];
    } else if ([moduleName isEqualToString:@"WebView"]) {
        vc = [[ARInternalMobileWebViewController alloc] initWithURL:[NSURL URLWithString:props[@"url"]]];
    } else {
        [NSException raise:@"Unrecognized native module name" format:@"%@", moduleName];
    }
    [self presentViewController:vc modalPresentationStyle:modalPresentationStyle];
}

RCT_EXPORT_METHOD(presentReactScreen:(nonnull NSString *)moduleName props:(nonnull NSDictionary *)props modal:(BOOL)modal hidesBackButon:(BOOL)hidesBackButton)
{
    UIModalPresentationStyle modalPresentationStyle = modal ? UIModalPresentationPageSheet : -1;
    
    if ([UIDevice isPad] && [moduleName isEqualToString:@"BidFlow"]) {
        modalPresentationStyle = UIModalPresentationFormSheet;
    }
    
    ARComponentViewController *vc = [[ARComponentViewController alloc] initWithEmission:nil
                                                                    moduleName:moduleName
                                                             initialProperties:props];
    vc.hidesBackButton = hidesBackButton;

    [self presentViewController:vc modalPresentationStyle:modalPresentationStyle];
}

- (void)presentViewController:(UIViewController *)vc modalPresentationStyle:(UIModalPresentationStyle)modalPresentationStyle
{
    if (modalPresentationStyle != -1) {
        vc.modalPresentationStyle = modalPresentationStyle;

        [[ARTopMenuViewController sharedController] presentViewController:vc animated:YES completion:nil];
    } else {
        [[[ARTopMenuViewController sharedController] rootNavigationController] pushViewController:vc animated:true];
    }
}

RCT_EXPORT_METHOD(dismissModal)
{
    [[ARTopMenuViewController sharedController] dismissViewControllerAnimated:YES completion:nil];
}

RCT_EXPORT_METHOD(goBack)
{
    [[[ARTopMenuViewController sharedController] rootNavigationController] popViewControllerAnimated:YES];
}

@end
