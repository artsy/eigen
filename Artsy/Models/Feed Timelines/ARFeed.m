#import "ARFeedItems.h"

static NSDictionary *StaticFeedItemMap;
static NSSet *StaticFeedItemTypes;

static NSString *ARFeedCursorKey = @"ARFeedCursorKey";

@interface ARFeed ()
@property (nonatomic, copy) NSString *cursor;
@end

@implementation ARFeed

+ (void)initialize
{
    if (self == [ARFeed class]) {
        StaticFeedItemMap =  @{
            @"PartnerShow" : [ARPartnerShowFeedItem class],
            @"Post" : [ARPostFeedItem class]
        };

        StaticFeedItemTypes = [NSSet setWithArray:[StaticFeedItemMap allValues]];
    };
}

+ (NSSet *)feedItemTypes
{
    return StaticFeedItemTypes;
}

- (void)getFeedItemsWithCursor:(NSString *)cursor success:(void(^)(NSOrderedSet *))success failure:(void (^)(NSError *error))failure {
    [NSException raise:NSInvalidArgumentException format:@"NSObject %@[%@]: selector not recognized - use a subclass: ", NSStringFromClass([self class]), NSStringFromSelector(_cmd)];
}

- (NSOrderedSet *)parseItemsFromJSON:(NSDictionary *)result
{
    NSDictionary *feedItemMap = StaticFeedItemMap;
    NSMutableOrderedSet *objects = [[NSMutableOrderedSet alloc] init];
    id next = result[@"next"];

    if (next == [NSNull null]) {
        self.cursor = nil;
    } else {
        if ([next isKindOfClass:[NSString class]]) {
            self.cursor = next;

            // Sometimes the cursor is an NSNumber, so stringify it
        } else if ([next respondsToSelector:@selector(stringValue)]) {
            self.cursor =  [next stringValue];
            ARErrorLog(@"Got a weird next cursor for the feed but string'd %@ - ", self.cursor);

        } else {
            ARErrorLog(@"Got a weird next cursor for the feed %@ - ", self.cursor);
        }
    }

    for (NSDictionary *item in result[@"results"]) {
        NSString *type = item[@"_type"];
        Class itemClass = feedItemMap[type];
        if (itemClass) {
            NSError *error = nil;
            id object = [itemClass modelWithJSON:item error:&error];
            if (!error) {
                [objects addObject:object];
            } else {
                ARErrorLog(@"Error creating %@ - %@", type, error.localizedDescription);
            }
        } else {
            ARActionLog(@"Unknown feed item type %@! Ignoring!", type);
        }
    }

    // Don't return the mutable set
    return [NSOrderedSet orderedSetWithOrderedSet:objects];
}

#pragma mark - state restoration

- (void)encodeRestorableStateWithCoder:(NSCoder *)coder
{
    [coder encodeObject:self.cursor forKey:ARFeedCursorKey];
}

- (void)decodeRestorableStateWithCoder:(NSCoder *)coder
{
    if ([coder containsValueForKey:ARFeedCursorKey]) {

        id cursor = [coder decodeObjectForKey:ARFeedCursorKey];

        if ([cursor isKindOfClass:[NSString class]]){
            self.cursor = cursor;
        }
    }
}

@end
