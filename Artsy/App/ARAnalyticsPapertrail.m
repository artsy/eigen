#import "ARAnalyticsPapertrail.h"


@interface ARAnalyticsPapertrail ()
@property (nonatomic, strong) NSOutputStream *stream;
@property (nonatomic, strong) dispatch_queue_t queue;
@end


@implementation ARAnalyticsPapertrail

- (void)dealloc;
{
    [_stream close];
}

- (instancetype)initWithDestinationURL:(NSURL *)URL;
{
    if ((self = [super init])) {
        _queue = dispatch_queue_create("net.artsy.analytics-papertrail", DISPATCH_QUEUE_SERIAL);
        _stream = [[NSOutputStream alloc] initWithURL:URL append:YES];
        [_stream open];
    }
    return self;
}

- (void)didShowNewPageView:(NSString *)pageTitle withProperties:(NSDictionary *)properties;
{
    dispatch_async(self.queue, ^{
        NSMutableDictionary *slugs = [NSMutableDictionary new];
        for (NSString *key in properties.allKeys) {
            if ([key hasSuffix:@"slug"]) {
                slugs[key] = properties[key];
            }
        }
        if (slugs.count > 0) {
            NSError *error = nil;
            [NSJSONSerialization writeJSONObject:@{ @"screen": pageTitle, @"slugs": slugs }
                                        toStream:self.stream
                                         options:0
                                           error:&error];
            NSAssert(error == nil, @"Unable to save analytics papertrail: %@", error);
            NSInteger written = [self.stream write:"\n" maxLength:1];
            NSAssert(written == 1, @"Unable to append newline.");
        }
    });
}

@end
