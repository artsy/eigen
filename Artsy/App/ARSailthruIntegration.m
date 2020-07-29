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
    if ([properties isKindOfClass:[NSDictionary class]]) {
        // Sailthru's SDK crashes if we send it event properties with NSNull values.
        // This happens because they try to serialize the properties into NSUserDefaults,
        // which crashes the app.
        NSMutableDictionary *filteredDictionary = [NSMutableDictionary dictionary];
        for (NSString *key in [properties allKeys]) {
            id value = properties[key];
            if (![value isKindOfClass:[NSNull class]]) {
                filteredDictionary[@"key"] = value;
            }
        }
        // I really don't trust Sailthru's SDK to not crash, so let's be extra careful here.
        @try {
            [self.sailThru logEvent:event withVars:filteredDictionary];
        } @catch (NSException *exception) {
            NSLog(@"Failed to send event to Sailthr: %@", exception);
        }
    }
}

-(void)identifyUserWithID:(id)userID andEmailAddress:(id)email
{
    [self.sailThru setUserId:userID withResponse:nil];
    [self.sailThru setUserEmail:email withResponse:nil];
}

@end
