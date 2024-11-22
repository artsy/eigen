#import "ARNavigationButton.h"
#import <FLKAutoLayout/FLKAutoLayout.h>

SpecBegin(ARNavigationButtonSpec);

__block ARNavigationButton *_view;
CGRect frame = CGRectMake(0, 0, 280, 60);

describe(@"ARNavigationButton", ^{
    describe(@"default border", ^{
        beforeEach(^{
            _view = [[ARNavigationButton alloc] initWithFrame:frame];
            [_view constrainWidth:@"280"];
        });

        it(@"title", ^{
            _view.title = @"Hello World";
            expect(_view).to.haveValidSnapshotNamed(@"navigationButtonWithTitle");
        });

        it(@"title and subtitle", ^{
            _view.title = @"Title";
            _view.subtitle = @"Subtitle";
            expect(_view).to.haveValidSnapshotNamed(@"navigationButtonWithTitleAndSubtitle");
        });

        it(@"really long title and subtitle", ^{
            _view.title = @"Title and Title and Title and Title and Title and ";
            _view.subtitle = @"Subtitle and Subtitle and Subtitle and Subtitle and Subtitle and Subtitle and Subtitle and";
            expect(_view).to.haveValidSnapshot();
        });
    });

    describe(@"thick border", ^{
        beforeEach(^{
            _view = [[ARNavigationButton alloc] initWithFrame:frame withBorder:5];
            [_view constrainWidth:@"280"];
        });

        it(@"title", ^{
            _view.title = @"Hello World";
            expect(_view).to.haveValidSnapshotNamed(@"navigationButtonWithTitleAnd5pxBorder");
        });

        it(@"title and subtitle", ^{
            _view.title = @"Title";
            _view.subtitle = @"Subtitle";
            expect(_view).to.haveValidSnapshotNamed(@"navigationButtonWithTitleAndSubtitleAnd5pxBorder");
        });
    });

    describe(@"no border", ^{
        beforeEach(^{
            _view = [[ARNavigationButton alloc] initWithFrame:frame withBorder:0];
            [_view constrainWidth:@"280"];
        });

        it(@"title", ^{
            _view.title = @"Hello World";
            expect(_view).to.haveValidSnapshotNamed(@"navigationButtonWithTitleAndNoBorder");
        });

        it(@"title and subtitle", ^{
            _view.title = @"Title";
            _view.subtitle = @"Subtitle";
            expect(_view).to.haveValidSnapshotNamed(@"navigationButtonWithTitleAndSubtitleAndNoBorder");
        });
    });
});

describe(@"ARSerifNavigationButton", ^{
    beforeEach(^{
        _view = [[ARSerifNavigationButton alloc] initWithFrame:frame];
        [_view constrainWidth:@"280"];
    });

    it(@"title", ^{
        _view.title = @"Hello World";
        expect(_view).to.haveValidSnapshotNamed(@"serifNavigationButtonWithTitle");
    });

    it(@"title and subtitle", ^{
        _view.title = @"Title";
        _view.subtitle = @"Subtitle";
        expect(_view).to.haveValidSnapshotNamed(@"serifNavigationButtonWithTitleAndSubtitle");
    });


    it(@"really long title and subtitle", ^{
        _view.title = @"Title and Title and Title and Title and Title and ";
        _view.subtitle = @"Subtitle and Subtitle and Subtitle and Subtitle and Subtitle and Subtitle and Subtitle and";
        expect(_view).to.haveValidSnapshot();
    });

});

SpecEnd;
