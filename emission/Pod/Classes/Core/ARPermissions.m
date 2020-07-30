//
//  ARPermissions.m
//  Emission
//
//  Created by Brian Beckerle on 7/30/20.
//

#import "ARPermissions.h"

@implementation ARPermissions

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetchNotificationPermissions:(RCTResponseSenderBlock)callback)
{
  callback(@[[NSNull null], @"hereIsWhereIShouldPassPermissions"]);
}

@end

