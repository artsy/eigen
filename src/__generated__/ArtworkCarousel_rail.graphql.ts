/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkCarouselHeader_rail$ref } from "./ArtworkCarouselHeader_rail.graphql";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _ArtworkCarousel_rail$ref: unique symbol;
export type ArtworkCarousel_rail$ref = typeof _ArtworkCarousel_rail$ref;
export type ArtworkCarousel_rail = {
    readonly id: string;
    readonly key: string | null;
    readonly params: {
        readonly medium: string | null;
        readonly price_range: string | null;
    } | null;
    readonly context: ({
        readonly artist?: {
            readonly href: string | null;
        } | null;
        readonly href?: string | null;
    } & ({
        readonly artist: {
            readonly href: string | null;
        } | null;
    } | {
        readonly href: string | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
    readonly results: ReadonlyArray<{
        readonly " $fragmentRefs": GenericGrid_artworks$ref;
    } | null> | null;
    readonly " $fragmentRefs": ArtworkCarouselHeader_rail$ref;
    readonly " $refType": ArtworkCarousel_rail$ref;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "href",
    "args": null,
    "storageKey": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artist",
    "storageKey": null,
    "args": null,
    "concreteType": "Artist",
    "plural": false,
    "selections": (v0/*: any*/)
  }
];
return {
  "kind": "Fragment",
  "name": "ArtworkCarousel_rail",
  "type": "HomePageArtworkModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "key",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "params",
      "storageKey": null,
      "args": null,
      "concreteType": "HomePageModulesParams",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "medium",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "price_range",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextFollowedArtist",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextRelatedArtist",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextFair",
          "selections": (v0/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextGene",
          "selections": (v0/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextSale",
          "selections": (v0/*: any*/)
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Artwork",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "GenericGrid_artworks",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkCarouselHeader_rail",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'd49057667cab8b5f596beb273fabec03';
export default node;
