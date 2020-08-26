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

@implementation ARScreenPresenterModule
RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue;
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(presentNativeScreen:(nonnull NSString *)moduleName props:(nonnull NSDictionary *)props  modal:(BOOL)modal)
{

}

RCT_EXPORT_METHOD(presentReactScreen:(nonnull NSString *)moduleName props:(nonnull NSDictionary *)props modal:(BOOL)modal hidesBackButon:(BOOL)hidesBackButton)
{
    UIViewController *vc = [[ARComponentViewController alloc] initWithEmission:nil
                                                                    moduleName:moduleName initialProperties:props];
  
    vc.modalPresentationStyle = UIModalPresentationFullScreen;
    
    if ([UIDevice isPad] && [moduleName isEqualToString:@"BidFlow"]) {
        vc.modalPresentationStyle = UIModalPresentationFormSheet;
    }
    
    if (modal) {
        [[ARTopMenuViewController sharedController] presentViewController:vc animated:YES completion:nil];
    } else {
        [[[ARTopMenuViewController sharedController] rootNavigationController] pushViewController:vc animated:true];
    }
}

RCT_EXPORT_METHOD(dismissModal)
{
    [[ARTopMenuViewController sharedController] dismissViewControllerAnimated:YES completion:nil];
}

@end
