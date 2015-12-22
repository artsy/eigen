#import "ARArtworkInfoViewController.h"
#import "ARTextView.h"
#import "ARSwitchBoard.h"
#import "ARSwitchboard+Eigen.h"
#import "ARExternalWebBrowserViewController.h"
#import "EXPMatcher+UINavigationController.h"


@interface ARArtworkInfoViewController (Tests) <ARTextViewDelegate>
@property (nonatomic, strong) ORStackScrollView *view;
@end


SpecBegin(ARArtworkInfoViewController);

__block ARArtworkInfoViewController *vc;

describe(@"more info", ^{
    it(@"displays correctly", ^{
        
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"provenance" : @"Ancient Hoboken",
            @"signature" : @"John Hancock",
            @"additional_information" : @"The more you know, with *markdown* and [a link](http://www.google.com/)",
            @"literature": @"Books About Art",
            @"exhibition_history" : @"Metro Pictures April 2014"
        }];
        
        vc = [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        
        expect(vc).to.haveValidSnapshot();
    });
    
    it(@"displays correctly when missing section", ^{
        
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"provenance" : @"Ancient Hoboken",
            @"additional_information" : @"The more you know",
            @"literature": @"Books About Art",
            @"exhibition_history" : @"Metro Pictures April 2014"
        }];
        
        vc = [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        
        expect(vc).to.haveValidSnapshot();
    });

    it(@"opens a link in the browser", ^{
       
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"provenance" : @"Ancient Hoboken",
            @"signature" : @"John Hancock",
            @"additional_information" : @"The more you know, with *markdown* and [a link](http://www.google.com/)",
            @"literature": @"Books About Art",
            @"exhibition_history" : @"Metro Pictures April 2014"
        }];
        
        vc = [[ARArtworkInfoViewController alloc] initWithArtwork:artwork];
        [vc ar_presentWithFrame:[UIScreen mainScreen].bounds];
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:vc];
        ARTextView *textView = [vc.view.stackView.subviews find:^BOOL(id view) {
            return [view isKindOfClass:ARTextView.class];
        }];

        NSURL *URL = [NSURL URLWithString:@"http://google.com"];
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:URL];
        if (!viewController) {
            failure(@"No external view controller returned");
        } else {
            [textView.viewControllerDelegate textView:textView shouldOpenViewController:viewController];
            expect(navigationController).to.haveViewControllerClasses(@[ARArtworkInfoViewController.class, ARExternalWebBrowserViewController.class]);
        }

    });

});

SpecEnd;
