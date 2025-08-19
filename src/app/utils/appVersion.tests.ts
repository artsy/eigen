import DeviceInfo from 'react-native-device-info'
import { appJson } from './jsonFiles'
import { getAppVersion, getBuildNumber } from './appVersion'

jest.mock('react-native-device-info')
jest.mock('./jsonFiles')

const mockAppJson = appJson as jest.MockedFunction<typeof appJson>

describe('appVersion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAppVersion', () => {
    it('returns DeviceInfo.getVersion() when available', () => {
      jest.spyOn(DeviceInfo, 'getVersion').mockReturnValue('1.2.3')
      mockAppJson.mockReturnValue({ version: '4.5.6' } as any)

      const result = getAppVersion()

      expect(result).toBe('1.2.3')
      expect(DeviceInfo.getVersion).toHaveBeenCalled()
    })

    it('falls back to appJson().version when DeviceInfo.getVersion() returns null', () => {
      jest.spyOn(DeviceInfo, 'getVersion').mockReturnValue(null as any)
      mockAppJson.mockReturnValue({ version: '4.5.6' } as any)

      const result = getAppVersion()

      expect(result).toBe('4.5.6')
      expect(DeviceInfo.getVersion).toHaveBeenCalled()
      expect(mockAppJson).toHaveBeenCalled()
    })

    it('falls back to appJson().version when DeviceInfo.getVersion() returns undefined', () => {
      jest.spyOn(DeviceInfo, 'getVersion').mockReturnValue(undefined as any)
      mockAppJson.mockReturnValue({ version: '7.8.9' } as any)

      const result = getAppVersion()

      expect(result).toBe('7.8.9')
      expect(DeviceInfo.getVersion).toHaveBeenCalled()
      expect(mockAppJson).toHaveBeenCalled()
    })

    it('falls back to appJson().version when DeviceInfo.getVersion() returns empty string', () => {
      jest.spyOn(DeviceInfo, 'getVersion').mockReturnValue('')
      mockAppJson.mockReturnValue({ version: '1.0.0' } as any)

      const result = getAppVersion()

      expect(result).toBe('1.0.0')
      expect(DeviceInfo.getVersion).toHaveBeenCalled()
      expect(mockAppJson).toHaveBeenCalled()
    })
  })

  describe('getBuildNumber', () => {
    it('returns DeviceInfo.getBuildNumber()', () => {
      jest.spyOn(DeviceInfo, 'getBuildNumber').mockReturnValue('123')

      const result = getBuildNumber()

      expect(result).toBe('123')
      expect(DeviceInfo.getBuildNumber).toHaveBeenCalled()
    })
  })
})