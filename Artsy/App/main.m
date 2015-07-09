#import "ARAppDelegate.h"
#import <ORKeyboardReactingApplication/ORKeyboardReactingApplication.h>

int main(int argc, char *argv[])
{
    @autoreleasepool
    {
        return UIApplicationMain(argc, argv,
                                 NSStringFromClass([ORKeyboardReactingApplication class]),
                                 NSStringFromClass([JSDecoupledAppDelegate class]));
    }
}
