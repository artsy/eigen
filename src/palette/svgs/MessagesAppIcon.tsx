import React from "react"
import { Defs, LinearGradient, Path, Stop } from "react-native-svg"
import { Icon, IconProps } from "./Icon"

export const MessagesAppIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props} viewBox="0 0 23 23">
      <Path
        d="M17.375 1H5.625C3.07068 1 1 3.07069 1 5.625V17.375C1 19.9293 3.07068 22 5.625 22H17.375C19.9293 22 22 19.9293 22 17.375V5.625C22 3.07069 19.9293 1 17.375 1Z"
        fill="url(#paint0_linear)"
      />
      <Path
        d="M11.5001 4.63525C9.45582 4.63527 7.49531 5.31167 6.04982 6.51567C4.60433 7.71966 3.79225 9.35263 3.79224 11.0553C3.7941 12.1629 4.13991 13.2512 4.79605 14.2145C5.4522 15.1777 6.39637 15.9833 7.5368 16.5527C7.23306 17.2327 6.77751 17.8704 6.18903 18.4393C7.33024 18.239 8.40153 17.8181 9.3195 17.2095C10.0273 17.3847 10.7617 17.4742 11.5001 17.4754C13.5443 17.4754 15.5048 16.799 16.9503 15.595C18.3958 14.391 19.2079 12.7581 19.2079 11.0553C19.2079 9.35263 18.3958 7.71966 16.9503 6.51567C15.5048 5.31167 13.5443 4.63527 11.5001 4.63525Z"
        fill="white"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="11.6667"
          y1="20.606"
          x2="11.6667"
          y2="3.6062"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#0CBD2A" />
          <Stop offset="1" stopColor="#5BF675" />
        </LinearGradient>
      </Defs>
    </Icon>
  )
}
