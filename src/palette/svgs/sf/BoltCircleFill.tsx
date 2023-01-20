import { useColor } from "palette/hooks"
import { Icon, IconProps, Mask, Path, Rect } from "palette/svgs/Icon"
import { EMaskUnits } from "react-native-svg"

/** BoltCircleFill */
export const BoltCircleFill: React.FC<IconProps> = (props) => {
  const color = useColor()
  console.warn(EMaskUnits)
  return (
    <Icon {...props} viewBox="0 0 20 20">
      <Mask
        id="path-1-outside-1"
        maskUnits={"userSpaceOnUse" as EMaskUnits}
        x="0"
        y="0"
        width="20"
        height="20"
        fill="black"
      >
        <Rect fill={color("white100")} width="20" height="20" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM9.65332 10.6357H7.16602C6.98145 10.6357 6.84961 10.5082 6.84961 10.3369C6.84961 10.2402 6.89355 10.1523 6.96826 10.0556L10.9585 5.06782C11.2573 4.69428 11.7231 4.93598 11.5562 5.38862L10.2422 8.94819H12.7295C12.9141 8.94819 13.0415 9.08002 13.0415 9.24702C13.0415 9.34809 13.002 9.43598 12.9272 9.52827L8.93701 14.5205C8.63818 14.8896 8.16797 14.6479 8.33936 14.1953L9.65332 10.6357Z"
        />
      </Mask>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM9.65332 10.6357H7.16602C6.98145 10.6357 6.84961 10.5082 6.84961 10.3369C6.84961 10.2402 6.89355 10.1523 6.96826 10.0556L10.9585 5.06782C11.2573 4.69428 11.7231 4.93598 11.5562 5.38862L10.2422 8.94819H12.7295C12.9141 8.94819 13.0415 9.08002 13.0415 9.24702C13.0415 9.34809 13.002 9.43598 12.9272 9.52827L8.93701 14.5205C8.63818 14.8896 8.16797 14.6479 8.33936 14.1953L9.65332 10.6357Z"
        fill={color("blue100")}
      />
      <Path
        d="M9.65332 10.6357L11.5296 11.3283L12.5235 8.63569H9.65332V10.6357ZM6.96826 10.0556L5.40652 8.80622L5.396 8.81938L5.38569 8.83271L6.96826 10.0556ZM10.9585 5.06782L12.5202 6.31721L12.5202 6.31721L10.9585 5.06782ZM11.5562 5.38862L13.4324 6.08121L13.4325 6.08087L11.5562 5.38862ZM10.2422 8.94819L8.36594 8.2556L7.372 10.9482H10.2422V8.94819ZM12.9272 9.52827L11.3727 8.26984L11.365 8.27955L12.9272 9.52827ZM8.93701 14.5205L10.4915 15.7789L10.4993 15.7692L8.93701 14.5205ZM8.33936 14.1953L10.2098 14.9035L10.2127 14.8957L10.2156 14.8878L8.33936 14.1953ZM16 10C16 13.3137 13.3137 16 10 16V20C15.5228 20 20 15.5228 20 10H16ZM10 4C13.3137 4 16 6.68629 16 10H20C20 4.47715 15.5228 0 10 0V4ZM4 10C4 6.68629 6.68629 4 10 4V0C4.47715 0 0 4.47715 0 10H4ZM10 16C6.68629 16 4 13.3137 4 10H0C0 15.5228 4.47715 20 10 20V16ZM7.16602 12.6357H9.65332V8.63569H7.16602V12.6357ZM4.84961 10.3369C4.84961 11.7063 5.97279 12.6357 7.16602 12.6357V8.63569C7.54143 8.63569 7.96949 8.77093 8.31684 9.10125C8.6687 9.43586 8.84961 9.88988 8.84961 10.3369H4.84961ZM5.38569 8.83271C5.20692 9.06406 4.84961 9.58615 4.84961 10.3369H8.84961C8.84961 10.8942 8.58019 11.2405 8.55083 11.2785L5.38569 8.83271ZM9.39676 3.81843L5.40652 8.80622L8.53 11.305L12.5202 6.31721L9.39676 3.81843ZM13.4325 6.08087C13.7791 5.14144 13.5841 3.79417 12.3671 3.15047C11.2 2.53314 10.0047 3.05853 9.39676 3.81843L12.5202 6.31721C12.2111 6.70357 11.3982 7.16304 10.4969 6.68633C9.54577 6.18326 9.50018 5.18315 9.67978 4.69636L13.4325 6.08087ZM12.1184 9.64078L13.4324 6.08121L9.6799 4.69603L8.36594 8.2556L12.1184 9.64078ZM12.7295 6.94819H10.2422V10.9482H12.7295V6.94819ZM15.0415 9.24702C15.0415 7.93755 13.9803 6.94819 12.7295 6.94819V10.9482C12.332 10.9482 11.8971 10.7988 11.5549 10.4634C11.2148 10.1302 11.0415 9.68521 11.0415 9.24702H15.0415ZM14.4817 10.7867C14.7402 10.4674 15.0415 9.9485 15.0415 9.24702H11.0415C11.0415 9.02309 11.088 8.80951 11.1662 8.62171C11.2396 8.44574 11.326 8.32758 11.3728 8.26987L14.4817 10.7867ZM10.4993 15.7692L14.4895 10.777L11.365 8.27955L7.37474 13.2717L10.4993 15.7692ZM6.46895 13.487C6.10916 14.4372 6.3091 15.7875 7.52407 16.4325C8.67558 17.0438 9.87203 16.5441 10.4915 15.7788L7.38252 13.2621C7.70317 12.866 8.5151 12.4299 9.39963 12.8995C10.3476 13.4028 10.3982 14.4059 10.2098 14.9035L6.46895 13.487ZM7.77707 9.9431L6.4631 13.5027L10.2156 14.8878L11.5296 11.3283L7.77707 9.9431Z"
        fill={color("white100")}
        mask="url(#path-1-outside-1)"
      />
    </Icon>
  )
}
