/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _FairBoothPreview_show$ref: unique symbol;
export type FairBoothPreview_show$ref = typeof _FairBoothPreview_show$ref;
export type FairBoothPreview_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly name: string | null;
    readonly is_fair_booth: boolean | null;
    readonly counts: {
        readonly artworks: number | null;
    } | null;
    readonly partner: ({
        readonly name?: string | null;
        readonly href?: string | null;
        readonly slug?: string;
        readonly internalID?: string;
        readonly id?: string;
        readonly profile?: {
            readonly internalID: string;
            readonly is_followed: boolean | null;
        } | null;
    } & ({
        readonly name: string | null;
        readonly href: string | null;
        readonly slug: string;
        readonly internalID: string;
        readonly id: string;
        readonly profile: {
            readonly internalID: string;
            readonly is_followed: boolean | null;
        } | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
    readonly fair: {
        readonly name: string | null;
    } | null;
    readonly cover_image: {
        readonly url: string | null;
    } | null;
    readonly location: {
        readonly display: string | null;
    } | null;
    readonly artworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": GenericGrid_artworks$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": FairBoothPreview_show$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairBoothPreview_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    {
      "kind": "ScalarField",
      "alias": "is_fair_booth",
      "name": "isFairBooth",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            (v2/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "href",
              "args": null,
              "storageKey": null
            },
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "profile",
              "storageKey": null,
              "args": null,
              "concreteType": "Profile",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": "is_followed",
                  "name": "isFollowed",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "fair",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": false,
      "selections": [
        (v2/*: any*/)
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "cover_image",
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "display",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "artworks",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:4)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 4
        }
      ],
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtworkEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                {
                  "kind": "FragmentSpread",
                  "name": "GenericGrid_artworks",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'e7b099c3d4951e2459d0b8527811ce38';
export default node;
