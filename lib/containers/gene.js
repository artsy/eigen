/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { ScrollView, View, Dimensions } from 'react-native'

import ParallaxScrollView from 'react-native-parallax-scroll-view'

import Events from '../native_modules/events'

import Separator from '../components/separator'
import SerifText from '../components/text/serif'
import WhiteButton from '../components/buttons/flat_white'

import About from '../components/gene/about'
import Header from '../components/gene/header'
import Artworks from '../components/gene/artworks'

import SwitchView from '../components/switch_view'
import type SwitchEvent from '../components/events'

import Refine from '../native_modules/refine_callback'


const TABS = {
  WORKS: 'WORKS',
  ABOUT: 'ABOUT',
}

// The title of the gene when scrolled, with margins
const HeaderHeight = 64

  /**
   *  There are 3 different major views inside this componentDidUpdate
   *
   *   - Foreground [title, follow, switch]
   *   - Sticky Refine [work counter, refine]
   *   - Section inside tab [artworks || about + related artists]
   *
   *   Nuance:
   *
   *   - The foreground switches between the "foreground" and "sticky header"
   *     the foreground being the title, buttons and switch, the header being
   *     just the title. It only does this for Artworks, not about.
   *
   *   - The sticky refine, when scrolled up _gains_ a 64px margin
   *     this is so it can reach all the way of the screen, and fit
   *     the sticky header's mini title inside it.
   *
   *   - We use a fork of react-native-parallax-scroll-view which has access
   *     to change the style component of the header, as well as a well-ordered
   *     API for inserting a component into the tree. This is used so that the
   *     sticky refine section will _always_ be at a specific index, making sure
   *     the `stickyHeaderIndices` is always at the right index.
   *
   */

class Gene extends React.Component {

  state: {
    selectedTabIndex: number,
  };

  componentWillMount() {
    this.state = { selectedTabIndex: 0, showingStickyHeader: 1 }
  }

  switchSelectionDidChange = (event: SwitchEvent) => {
    this.setState({ selectedTabIndex: event.nativeEvent.selectedIndex })
  }

  availableTabs = () => {
    return [TABS.WORKS, TABS.ABOUT]
  }

  selectedTabTitle = () => {
    return this.availableTabs()[this.state.selectedTabIndex]
  }

  // This is *not* called on the initial render, thus it will only post events for when the user actually taps a tab.
  // TODO: This was getting called far more than expected.
  // componentDidUpdate(previousProps, previousState) {
  //   Events.postEvent(this, {
  //     name: 'Tapped gene view tab',
  //     tab: this.selectedTabTitle().toLowerCase(),
  //     gene_id: this.props.gene._id,
  //     gene_slug: this.props.gene.id,
  //   })
  // }

  renderSectionForTab = () => {
    switch (this.selectedTabTitle()) {
      case TABS.ABOUT: return <About gene={this.props.gene} />
      case TABS.WORKS: return <Artworks
        gene={this.props.gene}
        stateQuery={this.stateQuery}
        resolveQuery={this.resolveQuery}
      />
    }
  }

  get commonPadding(): number {
    const windowDimensions = Dimensions.get('window')
    return windowDimensions.width > 700 ? 40 : 20
  }

  get showingArtworksSection(): bool {
    return this.selectedTabTitle() === TABS.WORKS
  }

  foregroundHeight(): ?number {
    return 200
  }

  // Top of the Component
  renderForeground = () => {
    return (
      <View style={{ backgroundColor:'white', paddingLeft: this.commonPadding, paddingRight: this.commonPadding }}>
          <Header gene={this.props.gene} shortForm={false} />
          <SwitchView style={{ marginTop:30 }}
            titles={this.availableTabs()}
            selectedIndex={this.state.selectedTabIndex}
            onSelectionChange={this.switchSelectionDidChange} />
      </View>
    )
  }

  // Callback from the parallax that we have transistioned into the small title mode
  onChangeHeaderVisibility = (sticky) => {
    if (this.state.showingStickyHeader !== sticky) {
      // Set the state so we can change the margins on the refine section
      this.setState({ showingStickyHeader: sticky })
    }
  }

  // No sticky header if you're in the about section
  stickyHeaderHeight(): ?number {
    if (!this.showingArtworksSection) { return null }
    return HeaderHeight
  }

  refineTapped = (button) => {
    Refine.triggerRefine(this, {thing: 'OK'}).then( (newSettings) => {
      console.log('OK, got:')
      console.log(newSettings)
    }).catch( (error) => {
      console.log('Errr : ', error)
    })
  }

  // Title of the Gene
  renderStickyHeader = () => {
    if (!this.showingArtworksSection) { return null }
    const commonPadding = this.commonPadding
    return (
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding, backgroundColor: 'white' }}>
        <Header gene={this.props.gene} shortForm={true} />
      </View>
    )
  }

  // Count of the works, and the refine button - sticks to the top of screen when scrolling
  renderStickyRefineSection = () => {
    if (!this.showingArtworksSection) { return null }
    const topMargin = this.state.showingStickyHeader ? 0 : HeaderHeight
    const filterInfo = this.props.gene.filtered_artworks ? this.props.gene.filtered_artworks.total : "-"
    return (<View style={{ backgroundColor: 'white'}}>
        <Separator style={{marginTop:topMargin}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 32, marginTop:8, marginBottom:8, paddingLeft: this.commonPadding, paddingRight: this.commonPadding}} >
          <SerifText>{ filterInfo } works</SerifText>
          <WhiteButton text="REFINE" style={{ marginTop:8, height: 20, width: 90}} onPress={this.refineTapped}/>
        </View>
        <Separator/>
      </View>)
  }

  render() {
    const stickyTopMargin = this.state.showingStickyHeader ?  0 : -HeaderHeight

    return (
      <ParallaxScrollView
        scrollsToTop={true}
        fadeOutForeground={false}
        backgroundScrollSpeed={1}

        backgroundColor="white"
        contentBackgroundColor="white"
        renderForeground={this.renderForeground}

        stickyHeaderHeight={this.stickyHeaderHeight()}
        renderStickyHeader={this.renderStickyHeader}

        onChangeHeaderVisibility={this.onChangeHeaderVisibility}

        stickyHeaderIndices={[1]}
        renderBodyComponentHeader={this.renderStickyRefineSection}

        parallaxHeaderHeight={this.foregroundHeight()}
        parallaxHeaderContainerStyles={{marginBottom:stickyTopMargin}}
        >

        <View style={{ marginTop:20, paddingLeft: this.commonPadding, paddingRight: this.commonPadding }}>
            { this.renderSectionForTab() }
        </View>

      </ParallaxScrollView>
    )
  }

  artworkQueryUpdatedString = (newString: string) => {

  }

  stateQuery = () => { }

  resolveQuery = (component: ArtworksGrid, page: number, state: any) : string =>
    Gene.artworksQuery(this.props.gene.id, this.props, page)

  static artworksQuery = (geneID: string, settings: ?any, page: number) => {
    const mediumParam = settings && settings.medium ? settings.medium : '*'
    const priceParam = settings && settings.price_range ? settings.price_range : '*-*'

    return `
    {
      gene(id: "${geneID}") {
        filtered_artworks(medium: "${mediumParam}", price_range: "${priceParam}", page:${page}, aggregations:[TOTAL]){
          total
          hits {
            id
            title
            date
            sale_message
            image {
              url(version: "large")
              aspect_ratio
            }
            artist {
              name
            }
            partner {
              name
            }
            href
          }
        }
      }
    }
    `
  }
}

export default Relay.createContainer(Gene, {
  // fallbacks for when no medium/price_range is set
  initialVariables: {
    medium: '*',
    price_range: '*-*'
  },
  fragments: {
    gene: () => Relay.QL`
      fragment on Gene {
        _id
        id
        ${Header.getFragment('gene')}
        ${About.getFragment('gene')}
        filtered_artworks(medium: $medium, price_range: $price_range, aggregations:[MEDIUM, PRICE_RANGE, TOTAL], page:1){
          total
          aggregations {
            slice
            counts {
              id
              name
            }
          }
        }
      }
    `,
  }
})
