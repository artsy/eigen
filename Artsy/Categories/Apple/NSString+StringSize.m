


@implementation NSString (StringSize)

- (CGSize)ar_sizeWithFont:(UIFont *)font constrainedToSize:(CGSize)size
{
    return [self boundingRectWithSize:size
                              options:NSLineBreakByWordWrapping | NSStringDrawingUsesLineFragmentOrigin
                           attributes:@{ NSFontAttributeName : font }
                              context:nil]
        .size;
}

@end
