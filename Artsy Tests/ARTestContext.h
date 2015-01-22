NS_ENUM(NSInteger, ARDeviceType){
    ARDeviceTypePhone4,
    ARDeviceTypePhone5,
    ARDeviceTypePad
};

@interface ARTestContext : NSObject

+ (void)stubDevice:(enum ARDeviceType)device;
+ (void)stopStubbing;

@end
