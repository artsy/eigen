#import "ARSailthruIntegration.h"
#import "ARAppDelegate.h"
#import <SailthruMobile/SailthruMobile.h>

@interface ARSailthruIntegration ()

/// Convenince accessor for the shared instance.
/// Sailthru says to create a new instance every time, but that seems wasteful.
@property (nonatomic, readonly) SailthruMobile *sailThru;

@end

@implementation ARSailthruIntegration

-(SailthruMobile *)sailThru
{
    return [[ARAppDelegate sharedInstance] sailThru];
}

-(void)setUserProperty:(id)property toValue:(id)value
{
    STMAttributes *attributes  = [[STMAttributes alloc] init];
    [attributes setString:value forKey:property];
    [self.sailThru setAttributes:attributes withResponse:nil];
}

-(void)event:(id)event withProperties:(id)properties
{
    [self.sailThru logEvent:event withVars:properties];
}

-(void)identifyUserWithID:(id)userID andEmailAddress:(id)email
{
    [self.sailThru setUserId:userID withResponse:nil];
    [self.sailThru setUserEmail:email withResponse:nil];
}

@end
