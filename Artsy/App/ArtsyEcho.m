#import "ArtsyEcho.h"
#import <Keys/ArtsyKeys.h>
#import <Foundation/Foundation.h>

@interface Aerodramus ()
- (void)updateWithJSONData:(NSData *)JSONdata;
@end

@implementation ArtsyEcho

- (instancetype)init {
    ArtsyKeys *keys = [ArtsyKeys new];
    NSURL *url = [[NSURL alloc] initWithString:@"https://echo-api-production.herokuapp.com/"];
    self = [self initWithServerURL:url accountID:1 APIKey:[keys artsyEchoProductionToken] localFilename:@"Echo"];
    return self;
}

- (void)setup {
    [super setup];

    NSLog(@"Aerodamus setup, routes: %@", self.routes);

    if (self.routes.count == 0) {
        NSLog(@"Routes are empty");
    }
}

- (void)updateWithJSONData:(NSData *)JSONdata {
    [super updateWithJSONData:JSONdata];

    NSLog(@"Aerodramus update, json string: %@", [[NSString alloc] initWithData:JSONdata encoding:NSUTF8StringEncoding]);
}

@end
