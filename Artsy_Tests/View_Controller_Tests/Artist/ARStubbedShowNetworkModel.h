#import "ARShowNetworkModel.h"


@interface ARStubbedShowNetworkModel : ARShowNetworkModel

- (instancetype)initWithFair:(Fair *)fair show:(PartnerShow *)show maps:(NSArray *)maps;

@property (nonatomic, strong, readonly) NSArray *maps;

@property (nonatomic, strong, readwrite) NSArray *imagesForBoothHeader;

@end
