#import "ARAppDelegateHelper.h"
#import "NotAppDelegate.h"

@interface ARAppDelegateHelper ()
@property (strong, nonatomic, readwrite) NSString *referralURLRepresentation;
@property (strong, nonatomic, readwrite) NSString *landingURLRepresentation;
@end

@implementation ARAppDelegateHelper

static ARAppDelegateHelper *_sharedInstance = nil;
static Braze *_braze = nil;

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [[ARAppDelegateHelper alloc] init];
    });
    return _sharedInstance;
}

+ (Braze *)braze {
    return _braze;
}

+ (void)setBraze:(Braze *)braze {
    _braze = braze;
}

- (void)setupWithLaunchOptions:(NSDictionary *)launchOptions {
    // Minimal setup for now - we'll move logic here in next milestone
    _landingURLRepresentation = _landingURLRepresentation ?: @"https://artsy.net";
}

- (void)applicationDidBecomeActive {
    // Minimal implementation for now
}

@end