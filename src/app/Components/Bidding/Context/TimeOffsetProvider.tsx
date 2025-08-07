import { TimeOffsetProviderQuery } from "__generated__/TimeOffsetProviderQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import PropTypes from "prop-types"
import React from "react"
import { fetchQuery, graphql } from "react-relay"

const getLocalTimestampInMilliSeconds = () => {
  return Date.now()
}

const fetchSystemTime = () =>
  fetchQuery<TimeOffsetProviderQuery>(
    getRelayEnvironment(),
    graphql`
      query TimeOffsetProviderQuery {
        system {
          time {
            unix
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: "network-only",
    }
  ).toPromise()

const getGravityTimestampInMilliSeconds = async () => {
  const startTime = getLocalTimestampInMilliSeconds()
  const systemTimeResponse = await fetchSystemTime()

  const system = systemTimeResponse?.system

  const possibleNetworkLatencyInMilliSeconds = (getLocalTimestampInMilliSeconds() - startTime) / 2
  const serverTimestampInMilliSeconds =
    (system?.time?.unix || 0) * 1e3 + possibleNetworkLatencyInMilliSeconds

  if (__DEV__) {
    if (typeof jest === "undefined") {
      console.log("Network latency in msec", possibleNetworkLatencyInMilliSeconds)
      console.log("  Gravity clock in msec", serverTimestampInMilliSeconds)
    }
  }

  return serverTimestampInMilliSeconds
}

export const getOffsetBetweenGravityClock = async () => {
  try {
    const gravityClock = await getGravityTimestampInMilliSeconds()
    const localClock = getLocalTimestampInMilliSeconds()

    const offsetInMilliSeconds = localClock - gravityClock

    if (__DEV__) {
      if (typeof jest === "undefined") {
        console.log("Gravity timestamp in msec", gravityClock)
        console.log("  Local timestamp in msec", localClock)
        console.log("           offset in msec", offsetInMilliSeconds)
      }
    }

    return offsetInMilliSeconds
  } catch (error) {
    console.error("src/app/Components/Bidding/Context/TimeOffsetProvider.tsx", error)

    // If something goes wrong (e.g. network error), just fall back to "no offset" since there is nothing we can do.
    return 0
  }
}

interface TimeOffsetProviderProps {
  children?: React.ReactNode
}

export class TimeOffsetProvider extends React.Component<TimeOffsetProviderProps> {
  static childContextTypes = {
    timeOffsetInMilliSeconds: PropTypes.number,
  }

  state = {
    timeOffsetInMilliSeconds: 0,
  }

  getChildContext() {
    return {
      timeOffsetInMilliSeconds: this.state.timeOffsetInMilliSeconds,
    }
  }

  async UNSAFE_componentWillMount() {
    const timeOffsetInMilliSeconds = await getOffsetBetweenGravityClock()

    this.setState({ timeOffsetInMilliSeconds })
  }

  render() {
    return this.props.children
  }
}
