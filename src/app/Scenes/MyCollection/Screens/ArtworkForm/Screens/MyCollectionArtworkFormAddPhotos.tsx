import { AddIcon, BorderBox, Box, Flex, XCircleIcon, useColor } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigationHeader as NavHeader } from "app/Components/NavigationHeader"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { Image as ImageProps } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { GlobalStore } from "app/store/GlobalStore"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox } from "app/utils/placeholders"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Image, TouchableOpacity } from "react-native"
import { isTablet } from "react-native-device-info"

const MARGIN = 2
export const DELAY_TIME_MS = 500

export const MyCollectionAddPhotos: React.FC<StackScreenProps<ArtworkFormScreen, "AddPhotos">> = ({
  navigation,
}) => {
  // By momentarily rendering a lighter placeholder, this page does not have to wait for large heavy
  // images to load first before rendering. Therefore the animation on Touchable tapped to load this
  // screen will not appear frozen while waiting for react navigation to fully load this page before
  // rendering.
  const [canRender, setCanRender] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setCanRender(true)
    }, DELAY_TIME_MS)
  }, [])

  const formValues = GlobalStore.useAppState(
    (state) => state.myCollection.artwork.sessionState.formValues
  )
  const { photos } = formValues
  const { width: screenWidth } = useScreenDimensions()
  const numColumns = isTablet() ? 5 : 2
  const imageSize = (screenWidth - MARGIN) / numColumns - MARGIN

  if (!canRender) {
    return (
      <>
        <NavHeader
          onLeftButtonPress={() => {
            requestAnimationFrame(() => {
              navigation.goBack()
            })
          }}
        >
          Photos {!!photos.length && `(${photos.length})`}
        </NavHeader>
        <Placeholder numColumns={numColumns} imageSize={imageSize} />
      </>
    )
  }

  return (
    <>
      <NavHeader
        onLeftButtonPress={() => {
          requestAnimationFrame(() => {
            navigation.goBack()
          })
        }}
      >
        Photos {!!photos.length && `(${photos.length})`}
      </NavHeader>
      <FlatList
        data={[{}, ...photos]}
        numColumns={numColumns}
        columnWrapperStyle={{
          flex: 1,
          marginHorizontal: MARGIN,
          marginVertical: MARGIN / 2,
        }}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return <AddPhotosButton imageSize={imageSize} />
          }
          return <ImageItem item={item} imageSize={imageSize} />
        }}
        keyExtractor={(item, index) => (item.path ?? "") + index}
        getItemLayout={(_, index) => ({
          length: imageSize,
          offset: imageSize * index,
          index,
        })}
      />
    </>
  )
}

const ImageItem: React.FC<{ item: ImageProps; imageSize: number }> = ({ item, imageSize }) => {
  const [deleting, setDeleting] = useState(false)

  const imageUrl = item.imageURL?.replace(":version", "square")

  return (
    <Flex mt={0.5}>
      <Image
        style={{ width: imageSize, height: imageSize, resizeMode: "cover" }}
        source={{ uri: imageUrl || item.path }}
      />
      {!deleting && (
        <DeletePhotoButton
          photo={item}
          onDelete={() => {
            setDeleting(true)
          }}
        />
      )}
      {!!deleting && <LoadingOverlay />}
    </Flex>
  )
}

const AddPhotosButton: React.FC<{ imageSize: number }> = ({ imageSize }) => {
  const color = useColor()
  const artworkActions = GlobalStore.actions.myCollection.artwork
  const { showActionSheetWithOptions } = useActionSheet()

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => {
        showPhotoActionSheet(showActionSheetWithOptions, true).then((images) => {
          artworkActions.addPhotos(images)
        })
      }}
    >
      <BorderBox
        mt={0.5}
        bg={color("mono0")}
        width={imageSize}
        height={imageSize}
        key="addMorePhotos"
      >
        <Flex flex={1} flexDirection="row" justifyContent="center" alignItems="center">
          <AddIcon width={30} height={30} />
        </Flex>
      </BorderBox>
    </TouchableOpacity>
  )
}

const DeletePhotoButton: React.FC<{ photo: ImageProps; onDelete: () => void }> = ({
  photo,
  onDelete,
}) => {
  const artworkActions = GlobalStore.actions.myCollection.artwork

  return (
    <Box position="absolute" right={-4} top={-5}>
      <TouchableOpacity
        accessibilityRole="button"
        hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
        onPress={() => {
          onDelete()
          requestAnimationFrame(() => {
            artworkActions.removePhoto(photo)
          })
        }}
      >
        <XCircleIcon width={20} height={20} />
      </TouchableOpacity>
    </Box>
  )
}

export const tests = {
  AddPhotosButton,
  DeletePhotoButton,
}

const LoadingOverlay: React.FC = () => {
  const color = useColor()
  return (
    <Flex
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      backgroundColor="rgba(255, 255, 255, 0.7)"
      alignItems="center"
      justifyContent="center"
      zIndex={10000}
    >
      <ActivityIndicator color={color("mono60")} />
    </Flex>
  )
}

const Placeholder: React.FC<{ imageSize: number; numColumns: number }> = ({
  imageSize,
  numColumns,
}) => {
  return (
    <FlatList
      data={Array(numColumns * 5).fill(1)}
      numColumns={numColumns}
      columnWrapperStyle={{
        flex: 1,
        justifyContent: "space-between",
        marginHorizontal: MARGIN,
        marginVertical: MARGIN / 2,
      }}
      renderItem={({ index }) => {
        if (index === 0) {
          return <AddPhotosButton imageSize={imageSize} />
        }
        return (
          <Flex>
            <PlaceholderBox width={imageSize} height={imageSize} />
          </Flex>
        )
      }}
      keyExtractor={(_, index) => "" + index}
      getItemLayout={(_, index) => ({
        length: imageSize,
        offset: imageSize * index,
        index,
      })}
    />
  )
}
