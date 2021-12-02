import { track as _track } from "lib/utils/track"
import { Box, Button, Flex, Sans, Spacer, Text } from "palette"
import React, { Component, useEffect, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export const SubmitArtworkOverview = () => {
  const content1 =
    "Break lamps and curl up into a ball thinking about you i'm joking it's food always food who's the baby. "
  const content2 = "We will only use these details to contact you regarding your submission"
  const content3 = "We will only use these details to contact you regarding your submission"
  return (
    <ScrollView
      style={{ flex: 1 }}
      alwaysBounceVertical={false}
      contentContainerStyle={{ paddingVertical: 20, justifyContent: "center" }}
    >
      <Spacer mb={3} />
      <CollapsibleMenuItem title="Artwork Details" content={content1} step={1} totalSteps={3} />
      <CollapsibleMenuItem title="Title 2" content={content2} step={2} totalSteps={3} />
      <CollapsibleMenuItem title="Title 3" content={content3} step={3} totalSteps={3} />
    </ScrollView>
  )
}
