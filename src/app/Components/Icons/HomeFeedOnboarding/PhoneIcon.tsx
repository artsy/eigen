import Svg, { G, Path, SvgProps } from "react-native-svg"

export const PhoneIcon = (props: SvgProps) => (
  <Svg width={18} height={18} viewBox="0 0 18 18" {...props}>
    <G fill="#000" fillRule="evenodd">
      <Path
        d="M12 2H6C5.73478 2 5.48043 2.10536 5.29289 2.29289C5.10536 2.48043 5 2.73478 5 3V15C5 15.2652 5.10536 15.5196 5.29289 15.7071C5.48043 15.8946 5.73478 16 6 16H12C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2ZM6 3H12V12H6V3ZM6 15V13H12V15H6Z"
        fillRule="nonzero"
      />
      <Path d="M8.5 13.5H9.5V14.5H8.5V13.5Z" fillRule="nonzero" />
    </G>
  </Svg>
)
