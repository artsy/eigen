#ifndef ARMacros_h
#define ARMacros_h

#define AR_CODER_DESIGNATED_INITIALIZER \
    NS_DESIGNATED_INITIALIZER;          \
    -(instancetype)initWithCoder : (NSCoder *)aDecoder NS_UNAVAILABLE;

#define AR_VC_DESIGNATED_INITIALIZER \
    AR_CODER_DESIGNATED_INITIALIZER; \
    -(instancetype)initWithNibName : (NSString *)nibNameOrNil bundle : (NSBundle *)nibBundleOrNil NS_UNAVAILABLE;

#define AR_OVERRIDE_SUPER_DESIGNATED_INITIALIZER(SIGNATURE)                             \
    -(instancetype)SIGNATURE;                                                           \
    {                                                                                   \
        NSAssert(NO, @"The `%s' initializer should not be used.", __PRETTY_FUNCTION__); \
        return nil;                                                                     \
    }

#define ar_keypath(anObject, aKeyPath) ((void)(NO && ((void)anObject.aKeyPath, NO)), @ #aKeyPath)

#endif
