#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

typedef void(^ARGetSelectedTabName)(_Nonnull RCTPromiseResolveBlock resolve, _Nonnull RCTPromiseRejectBlock reject);

@interface ARTopMenuModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, nullable, readwrite) ARGetSelectedTabName getSelectedTabName;

@end
