#import "ARTopMenuModule.h"

@implementation ARTopMenuModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getSelectedTabName:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    return self.getSelectedTabName(resolve, reject);
}

@end
