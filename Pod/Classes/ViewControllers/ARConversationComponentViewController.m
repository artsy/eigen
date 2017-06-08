#import "ARConversationComponentViewController.h"

@implementation ARConversationComponentViewController

- (instancetype)initWithConversationID:(NSString *)conversationID
{
    return [self initWithConversationID:conversationID emission:nil];
}
- (instancetype)initWithConversationID:(NSString *)conversationID
                         emission:(nullable AREmission *)emission
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"Conversation"
                      initialProperties:@{ @"conversationID": conversationID }])) {
        _conversationID = conversationID;
    }
    return self;
}

@end
