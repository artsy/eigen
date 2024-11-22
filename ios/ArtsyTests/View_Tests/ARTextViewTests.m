#import "ARTextView.h"

SpecBegin(ARTextView);

describe(@"with HTML", ^{
    it(@"looks right with multiple paragraphs", ^{
        ARTextView *textView = [[ARTextView alloc] init];
        [textView setHTMLString:@"<p>lorem ipsum</p><p><b>lorem</b> ipsum</p><p>lorem ipsum</p>"];
        textView.frame = CGRectMake(0, 0, 80, 200);
        expect(textView).to.haveValidSnapshot();
    });
});

SpecEnd;
