import { AuctionIcon, Box, Button, Flex, GenomeIcon, Input, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"
import { color } from "styled-system"

const ICON_SIZE = 14

export const MyAccountDeleteAccount: React.FC = () => {
  return (
    <ScrollView>
      <Box pr="2" pl="2">
        <Text variant="lg" mt="6">
          Delete My Account
        </Text>
        <Spacer mt="3" />
        <Text>Are you sure you want to delete your account?</Text>
        <Spacer mt="2" />
        <Text>If you delete your account:</Text>
        <Spacer mt="2" />
        <Flex flexDirection="row" alignItems="center" pr="1">
          <GenomeIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text variant="xs" color={color("black100")} px="1" pb="1px">
            {
              "You will lose all data on Artsy including all existing offers, inquiries and mesages with Galleries"
            }
          </Text>
        </Flex>
        <Spacer mt="2" />
        <Flex flexDirection="row" alignItems="center" pr="1">
          <AuctionIcon width={ICON_SIZE} height={ICON_SIZE} />
          <Text variant="xs" color={color("black100")} px="1" pb="1px">
            {
              "You won’t have access to any exclusive Artsy benefits, such as Artsy Curated Auctions, Private Sales, etc"
            }
          </Text>
        </Flex>
        <Spacer mt="3" />
        <Input multiline placeholder="Please share with us why you are leaving" />
        <Spacer mt="3" />
        <Text variant="xs" color={color("black100")} pb="1px">
          {
            "After you submit your request, we will disable your account. It may take up to 7 days to fully delete and remove all of our data."
          }
        </Text>
        <Spacer mt="2" />
        <Button block>Delete My Account</Button>
        <Spacer mt="1" />
        <Button block variant="outline">
          Cancel
        </Button>
      </Box>
    </ScrollView>
  )
}
