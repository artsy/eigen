#import "ARAppDelegate.h"
#import <ORKeyboardReactingApplication/ORKeyboardReactingApplication.h>

int main(int argc, char *argv[])
{
    @autoreleasepool
    {
        NSString *appDelegate = @"JSDecoupledAppDelegate";
#ifdef DEBUG
        if (NSClassFromString(@"XCTestCase")) {
            appDelegate = @
