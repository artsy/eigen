#import <ORStackView/ORStackView.h>
#import "ORStackView+ArtsyViews.h"


@interface ORStackView (Testing)
@property (nonatomic, strong) NSMutableArray *viewStack;
@end

SpecBegin(ORStackViewArtsyCategories);

describe(@"when adding a page title", ^{
    it(@"adds another view to the stack", ^{
        ORStackView *stackView = [[ORStackView alloc] init];
        expect(stackView.viewStack.count).to.equal(0);

        [stackView addPageTitleWithString:@"Test"];
        expect(stackView.viewStack.count).to.equal(1);
    });

    it(@"sets the title correctly", ^{
        ORStackView *stackView = [[ORStackView alloc] init];
        NSString *title = @"Testering";
        [stackView addPageTitleWithString:title];

        UIView *titleLabel = [stackView.viewStack.firstObject view];
        expect(titleLabel).to.beKindOf([UILabel class]);
        expect([((UILabel *) titleLabel) text]).to.equal(title.uppercaseString);
    });

    it(@"returns the title label", ^{
        ORStackView *stackView = [[ORStackView alloc] init];
        NSString *title = @"Testering";
        UIView *titleLabel = [stackView addPageTitleWithString:title];

        expect(titleLabel).to.beKindOf([UILabel class]);
        expect([((UILabel *) titleLabel) text]).to.equal(title.uppercaseString);
    });

});

describe(@"when adding a page subtitle", ^{
    it(@"adds another view to the stack", ^{
        ORStackView *stackView = [[ORStackView alloc] init];
        expect(stackView.viewStack.count).to.equal(0);

        [stackView addPageSubtitleWithString:@"Test"];
        expect(stackView.viewStack.count).to.equal(1);
    });

    it(@"sets the title correctly", ^{
        ORStackView *stackView = [[ORStackView alloc] init];
        NSString *title = @"Testering2";
        [stackView addPageSubtitleWithString:title];

        UIView *titleLabel = [stackView.viewStack.firstObject view];
        expect(titleLabel).to.beKindOf([UILabel class]);
        expect([((UILabel *) titleLabel) text]).to.equal(title.uppercaseString);
    });
});

describe(@"when adding an alt page title and subtitle", ^{
    it(@"adds 2 views to the stack", ^{
        ORStackView *stackView = [[ORStackView alloc] init];
        expect(stackView.viewStack.count).to.equal(0);

        [stackView addSerifPageTitle:@"title" subtitle:@"subtitle"];
        expect(stackView.viewStack.count).to.equal(2);
    });

    it(@"sets the title correctly", ^{
        ORStackView *stackView = [[ORStackView alloc] init];
        NSString *title = @"Testering3";
        NSString *subtitle = @"Testering3";
        [stackView addSerifPageTitle:title subtitle:subtitle];

        UILabel *hopefullyTitleLabel = (id)[stackView.viewStack.firstObject view];
        expect([hopefullyTitleLabel text]).to.equal(title);

        UILabel *hopefullySubtitleLabel = (id)[stackView.viewStack[1] view];
        expect([hopefullySubtitleLabel text]).to.equal(subtitle);
    });
});


SpecEnd;
