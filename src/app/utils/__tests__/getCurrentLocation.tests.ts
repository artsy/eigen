import Geolocation from "@react-native-community/geolocation"
import { getCurrentLocation } from "app/utils/getCurrentLocation"
import { PermissionsAndroid, Platform } from "react-native"

const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } = PermissionsAndroid.PERMISSIONS
const { GRANTED, DENIED } = PermissionsAndroid.RESULTS

describe(getCurrentLocation, () => {
  const originalOS = Platform.OS

  beforeEach(() => {
    jest.clearAllMocks()
    Platform.OS = "android"
    ;(Geolocation.getCurrentPosition as jest.Mock).mockImplementation((onSuccess) =>
      onSuccess({ coords: { latitude: 40.7, longitude: -73.99, accuracy: 15 } })
    )
  })

  afterEach(() => {
    Platform.OS = originalOS
    jest.restoreAllMocks()
  })

  const grant = (fine: string, coarse: string) =>
    jest
      .spyOn(PermissionsAndroid, "requestMultiple")
      .mockResolvedValue({ [ACCESS_FINE_LOCATION]: fine, [ACCESS_COARSE_LOCATION]: coarse } as any)

  it("asks Android for precise and approximate location together", async () => {
    const requestMultiple = grant(GRANTED, GRANTED)

    expect(await getCurrentLocation()).toEqual({
      status: "located",
      location: { lat: 40.7, lng: -73.99 },
    })
    expect(requestMultiple).toHaveBeenCalledWith([ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION])
    expect(Geolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({ enableHighAccuracy: true, maximumAge: 30000 })
    )
  })

  it("treats a coarse fix as approximate, as iOS gives with Precise Location off", async () => {
    grant(GRANTED, GRANTED)
    ;(Geolocation.getCurrentPosition as jest.Mock).mockImplementation((onSuccess) =>
      onSuccess({ coords: { latitude: 40.7, longitude: -73.99, accuracy: 3000 } })
    )

    expect(await getCurrentLocation()).toEqual({ status: "approximate" })
  })

  it("says so when the user only allows approximate location", async () => {
    grant(DENIED, GRANTED)

    expect(await getCurrentLocation()).toEqual({ status: "approximate" })
    expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled()
  })

  it("says so when the user refuses", async () => {
    grant(DENIED, DENIED)

    expect(await getCurrentLocation()).toEqual({ status: "denied" })
  })

  it("says so when the device can't find its position", async () => {
    grant(GRANTED, GRANTED)
    ;(Geolocation.getCurrentPosition as jest.Mock).mockImplementation((_, onError) => onError())

    expect(await getCurrentLocation()).toEqual({ status: "unavailable" })
  })
})
