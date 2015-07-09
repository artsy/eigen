#import "ARBrowseNetworkModel.h"


@interface ARStubbedBrowseNetworkModel : ARBrowseNetworkModel {
   @protected
    NSArray *_links;
}

@property (nonatomic, strong, readwrite) NSArray *links;
@end
