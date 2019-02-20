#import "ARFairSearchViewController.h"
#import "SearchResult.h"

#import "ArtsyAPI+Search.h"
#import "ARFonts.h"
#import "ARTopMenuViewController.h"
#import "ARSearchViewController+Private.h"
#import "Fair.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "ARDispatchManager.h"

#import "MTLModel+JSON.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@implementation ARFairSearchViewController

- (instancetype)initWithFair:(Fair *)fair
{
    self = [super init];

    if (!self) {
        return nil;
    }

    _fair = fair;

    return self;
}

- (void)viewDidLoad
{
    // Setup required before calling super.
    self.defaultInfoLabelText = @"Find Exhibitors & Artists";
    self.searchIconImageName = @"SearchIcon_HeavyGrey";
    
    // Call super.
    [super viewDidLoad];
    
    // Download local data for client-side search.
    [self.fair updateFair:^{
        [self.fair downloadShows];
        NSLog(@"Updated fair.");
    }];

    self.view.backgroundColor = [UIColor whiteColor];
    self.textField.textColor = [UIColor artsyGraySemibold];
    self.textField.tintColor = [UIColor artsyGraySemibold];
    self.textField.clearButtonMode = UITextFieldViewModeWhileEditing;
    [self.closeButton setTitleColor:[UIColor artsyGraySemibold] forState:UIControlStateNormal];

    self.searchDataSource.textColor = [UIColor artsyGraySemibold];
    self.searchDataSource.placeholderImage = [UIImage imageNamed:@"SearchThumb_HeavyGrey"];

    // fair search is a solid grey background
    UIView *searchBoxBackgroundView = [[UIView alloc] init];
    searchBoxBackgroundView.backgroundColor = [UIColor artsyGrayLight];
    [self.view insertSubview:searchBoxBackgroundView atIndex:0];

    [searchBoxBackgroundView alignLeadingEdgeWithView:self.view predicate:@"10"];
    [searchBoxBackgroundView alignTrailingEdgeWithView:self.closeButton predicate:@"-46"];
    [searchBoxBackgroundView alignTopEdgeWithView:self.view predicate:@"10"];
    [searchBoxBackgroundView constrainHeight:@"44"];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];

    [[[ARTopMenuViewController sharedController] rootNavigationController] showBackButton:NO animated:YES];
}

- (void)fetchSearchResults:(NSString *)text replace:(BOOL)replaceResults
{
    ar_dispatch_async(^{
        NSArray *partnerSearchResults = [self searchPartners:text];
        ar_dispatch_main_queue(^{
            [self addResults:partnerSearchResults replace:replaceResults];
            [super fetchSearchResults:text replace:NO];
        });
    });
}

- (NSArray *)searchPartners:(NSString *)query
{
    query = query.lowercaseString;
    NSMutableArray *results = [NSMutableArray array];
    NSSet *allShows = self.fair.shows;
    for (PartnerShow *show in allShows) {
        // booths are usually some text that ends with the booth number
        if ([show.locationInFair.lowercaseString hasSuffix:query]) {
            [results addObject:[SearchResult modelWithJSON:@{
                @"id" : show.showID,
                @"display" : show.locationInFair,
                @"model" : @"partnershow",
                @"label" : show.partner.partnerID,
                @"published" : @YES
            }]];
        } else {
            // partner names match by prefix and within each word of the partner name
            NSString *partnerName = show.partner.name.lowercaseString;
            NSString *partnerShortName = show.partner.shortName.lowercaseString;
            if ([partnerName hasPrefix:query] || [[partnerName componentsSeparatedByCharactersInSet:[NSCharacterSet whitespaceCharacterSet]] includes:query] || [partnerShortName hasPrefix:query] || [[partnerShortName componentsSeparatedByCharactersInSet:[NSCharacterSet whitespaceCharacterSet]] includes:query]) {
                [results addObject:[SearchResult modelWithJSON:@{
                    @"id" : show.showID,
                    @"display" : show.partner.name,
                    @"model" : @"partnershow",
                    @"label" : show.partner.partnerID,
                    @"published" : @YES
                }]];
            }
        }

        if (results.count == 5) {
            break;
        }
    }
    return results;
}

- (AFHTTPRequestOperation *)searchWithQuery:(NSString *)query success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    AFHTTPRequestOperation *request = [ArtsyAPI searchWithFairID:self.fair.fairID andQuery:query success:^(NSArray *searchResults) {
        success([searchResults select:^BOOL(SearchResult *searchResult) {
            // If we have local shows, do not include shows from the API
            return self.fair.shows == nil || self.fair.shows.count == 0 || ![searchResult.model isEqual:[PartnerShow class]];
        }]);
    } failure:failure];

    return request;
}

- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    [self.delegate selectedResult:result ofType:type fromQuery:query];
}

- (void)closeSearch:(id)sender
{
    [super closeSearch:sender];
    [[[ARTopMenuViewController sharedController] rootNavigationController] showBackButton:YES animated:YES];
    if ([self.delegate respondsToSelector:@selector(cancelledSearch:)]) {
        [self.delegate cancelledSearch:self];
    } else {
        [self clearSearchAnimated:YES];
    }
}

- (ARSearchViewControllerStylingMode)searchPresentationMode {
    return ARSearchViewControllerStylingModeFair;
}

@end
