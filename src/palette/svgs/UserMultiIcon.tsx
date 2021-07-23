import { useColor } from "palette/hooks"
import React from "react"
import { Icon, IconProps, Path } from "./Icon"

export const UserMultiIcon: React.FC<IconProps> = (props) => {
  const color = useColor()
  return (
    <Icon {...props} viewBox="0 0 18 18">
      <Path
        d="M11.654 10.226v3.214h-.875v-3.214c0-.725-.588-1.312-1.313-1.312h-.924c-.725 0-1.313.587-1.313 1.312v3.214h-.875v-3.214c0-.725-.587-1.312-1.312-1.312h-.853c-.725 0-1.313.587-1.313 1.312v3.214h-.875v-3.214c0-1.208.98-2.187 2.188-2.187h.853c.715 0 1.35.343 1.75.874a2.184 2.184 0 0 1 1.75-.874h.924c.716 0 1.351.343 1.75.874a2.184 2.184 0 0 1 1.75-.874h.88c1.207 0 2.187.98 2.187 2.187v3.214h-.875v-3.214c0-.725-.588-1.312-1.313-1.312h-.879c-.725 0-1.312.587-1.312 1.312zM4.41 7.01a1.866 1.866 0 1 1 0-3.732 1.866 1.866 0 0 1 0 3.732zm0-.875a.991.991 0 1 0 0-1.982.991.991 0 0 0 0 1.982zm4.5.875a1.866 1.866 0 1 1 0-3.732 1.866 1.866 0 0 1 0 3.732zm0-.875a.991.991 0 1 0 0-1.982.991.991 0 0 0 0 1.982zm4.5.875a1.866 1.866 0 1 1 0-3.732 1.866 1.866 0 0 1 0 3.732zm0-.875a.991.991 0 1 0 0-1.982.991.991 0 0 0 0 1.982z"
        fill={color(props.fill)}
        fillRule="nonzero"
      />
    </Icon>
  )
}

// TODO: remove this alias once clients have been updated
/** GroupIcon */
export const GroupIcon = UserMultiIcon
