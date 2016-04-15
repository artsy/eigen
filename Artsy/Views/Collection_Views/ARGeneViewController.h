#import <UIKit/UIKit.h>

@class Gene;


@interface ARGeneViewController : UIViewController

- (instancetype)initWithGeneID:(NSString *)geneID;
- (instancetype)initWithGene:(Gene *)gene;

@end
