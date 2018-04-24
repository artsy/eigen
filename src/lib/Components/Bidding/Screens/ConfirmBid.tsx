import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { Colors } from "lib/data/colors"
import { Fonts } from "lib/data/fonts"
import { InvertedButton } from "../../Buttons"

import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"

interface ConfirmBidProps extends ViewProperties {
  sale_artwork: ConfirmBid_sale_artwork
  bid: {
    display: string
    cents: number
  }
}

class ConfirmBid extends React.Component<ConfirmBidProps> {
  render() {
    return (
      <Container>
        <Header>Confirm your bid</Header>

        <ArtistInfo>{this.props.sale_artwork.artwork.artist_names}</ArtistInfo>

        <LotInfo>Lot {this.props.sale_artwork.lot_label}</LotInfo>

        <ArtworkInfo>
          {this.props.sale_artwork.artwork.title}, {this.props.sale_artwork.artwork.date}
        </ArtworkInfo>

        <MaxBidContainer>
          <Title>Max bid</Title>
          <Amount>{this.props.bid.display}</Amount>
        </MaxBidContainer>
        <NoteContainer>
          <Note>
            You agree to Artsy's <LinkText>Condition of Sale.</LinkText>
          </Note>
        </NoteContainer>
        <InvertedButton text="Place Bid" style={{ height: 46, margin: 10 }} />
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

const Header = styled.Text`
  font-family: "${Fonts.GaramondRegular}"; /* change to Semibold */
  flex: 1;
  margin: 18px;
  text-align: center;
  font-size: 20;
`

const ArtistInfo = styled.Text`
  font-family: "${Fonts.GaramondRegular}"; /* change to Semibold */
  text-align: center;
  font-size: 18;
`

const LotInfo = styled.Text`
  font-family: "${Fonts.GaramondRegular}"; /* change to Semibold */
  text-align: center;
  font-size: 14;
`

const ArtworkInfo = styled.Text`
  font-family: "${Fonts.GaramondItalic}";
  text-align: center;
  font-size: 14;
  color: ${Colors.GraySemibold};
`

const MaxBidContainer = styled.View`
  border-style: solid;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${Colors.GrayRegular};
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  margin-top: 20px;
`

const Title = styled.Text`
  font-family: "${Fonts.GaramondRegular}"; /* change to Semibold */
  font-size: 18;
  flex: 1;
`
const Amount = styled.Text`
  font-family: "${Fonts.GaramondRegular}";
  font-size: 18;
  flex: 1;
  text-align: right;
`

const NoteContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 10px;
`

const Note = styled.Text`
  font-family: "${Fonts.GaramondRegular}";
  text-align: center;
  font-size: 14;
  color: ${Colors.GraySemibold};
`

const LinkText = styled.Text`
  text-decoration-line: underline;
`

export const ConfirmBidScreen = createFragmentContainer(
  ConfirmBid,
  graphql`
    fragment ConfirmBid_sale_artwork on SaleArtwork {
      artwork {
        title
        date
        artist_names
      }
      lot_label
    }
  `
)
