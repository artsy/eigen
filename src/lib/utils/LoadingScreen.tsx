import Spinner from "lib/Components/Spinner"
import React from "react"

export const LoadingTestID = "relay-loading"

export const LoadingScreen = () => <Spinner testID={LoadingTestID} style={{ flex: 1 }} />
