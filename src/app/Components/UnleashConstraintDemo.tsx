import { Flex, Text } from "@artsy/palette-mobile"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useUnleashEnvironment } from "app/system/flags/hooks/useUnleashEnvironment"
import { getAppVersion } from "app/utils/appVersion"
import { Platform } from "react-native"

export const UnleashConstraintDemo: React.FC = () => {
  const versionGate = useExperimentFlag("onyx_demo-version-gate")
  const platformGate = useExperimentFlag("onyx_demo-platform-gate")
  const { unleashEnv } = useUnleashEnvironment()

  return (
    <Flex>
      <GateSection
        title="VERSION GATE"
        detail={`appVersion ${getAppVersion()} · unleash ${unleashEnv}`}
        enabled={versionGate}
      />
      <GateSection
        title="PLATFORM GATE"
        detail={`appPlatformOS ${Platform.OS} · unleash ${unleashEnv}`}
        enabled={platformGate}
      />
    </Flex>
  )
}

const GateSection: React.FC<{ title: string; detail: string; enabled: boolean }> = ({
  title,
  detail,
  enabled,
}) => (
  <Flex px={2} py={1} backgroundColor={enabled ? "green100" : "red100"}>
    <Text variant="sm" color="mono0" fontWeight="bold">
      {title}: {enabled ? "ON" : "OFF"}
    </Text>
    <Text variant="xs" color="mono0">
      {detail}
    </Text>
  </Flex>
)
