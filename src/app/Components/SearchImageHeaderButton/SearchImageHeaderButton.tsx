import { useFeatureFlag } from "app/store/GlobalStore"
import { useImageSearch } from "app/utils/useImageSearch"
import { AddIcon, Box, Spinner } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"

const CAMERA_ICON_CONTAINER_SIZE = 38
const CAMERA_ICON_SIZE = 20

interface SearchImageHeaderButtonProps {
  isImageSearchButtonVisible: boolean
}

export const SearchImageHeaderButton: React.FC<SearchImageHeaderButtonProps> = ({
  isImageSearchButtonVisible,
}) => {
  const isImageSearchEnabled = isImageSearchButtonVisible && useFeatureFlag("AREnableImageSearch")
  const { searchingByImage, handleSeachByImage } = useImageSearch()

  if (isImageSearchEnabled) {
    return (
      <TouchableOpacity
        style={{ position: "absolute", top: 33, right: 12 }}
        onPress={handleSeachByImage}
        disabled={searchingByImage}
      >
        <Box
          width={CAMERA_ICON_CONTAINER_SIZE}
          height={CAMERA_ICON_CONTAINER_SIZE}
          borderRadius={CAMERA_ICON_CONTAINER_SIZE / 2}
          bg="white"
          justifyContent="center"
          alignItems="center"
        >
          {searchingByImage ? (
            <Spinner size="small" />
          ) : (
            <AddIcon width={CAMERA_ICON_SIZE} height={CAMERA_ICON_SIZE} />
          )}
        </Box>
      </TouchableOpacity>
    )
  }

  return null
}
