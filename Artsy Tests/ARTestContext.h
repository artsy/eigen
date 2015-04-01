NS_ENUM(NSInteger, ARDeviceType){
    ARDeviceTypePhone4,
    ARDeviceTypePhone5,
    ARDeviceTypePhone6,
    ARDeviceTypePad
};

@interface ARTestContext : NSObject

+ (void)stubDevice:(enum ARDeviceType)device;
+ (void)stopStubbing;

@end
