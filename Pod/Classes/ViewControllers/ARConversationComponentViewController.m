#import "ARConversationComponentViewController.h"

@implementation ARConversationComponentViewController

- (instancetype)initWithInquiryID:(NSString *)inquiryID
{
    return [self initWithInquiryID:inquiryID emission:nil];
}
- (instancetype)initWithInquiryID:(NSString *)inquiryID
                         emission:(nullable AREmission *)emission
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"Conversation"
                      initialProperties:@{ @"inquiryID": inquiryID }])) {
        _inquiryID = inquiryID;
    }
    return self;
}

@end
