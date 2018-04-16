import React from "react"
import styled from "styled-components/native"

import { Colors } from "lib/data/colors"
import { Fonts } from "lib/data/fonts"
import { InvertedButton } from "../../Buttons"

// hard-coded values for now.
const saleArtwork = {
  artwork: {
    title: "Meteor Shower",
    date: "2015",
    artist_names: "Makiko Kudo",
  },
  lot_label: "538",
}

export class ConfirmBid extends React.Component<ConfirmBidProps> {
  // TODO move to utils?
  formatAmountCent(amount) {
    return !isNaN(amount) ? "$" + (amount / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
  }
  render() {
    return (
      <Container>
        <Header>Confirm your bid</Header>

        <ArtistInfo>{saleArtwork.artwork.artist_names}</ArtistInfo>

        <LotInfo>Lot {saleArtwork.lot_label}</LotInfo>

        <ArtworkInfo>
          {saleArtwork.artwork.title}, {saleArtwork.artwork.date}
        </ArtworkInfo>

        <MaxBidContainer>
          <Title>Max bid</Title>
          <Amount>{this.formatAmountCent(this.props.bidAmountCents)}</Amount>
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

interface ConfirmBidProps {
  saleArtworkID: string
  bidAmountCents: number
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
