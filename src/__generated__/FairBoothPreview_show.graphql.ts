/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _FairBoothPreview_show$ref: unique symbol;
export type FairBoothPreview_show$ref = typeof _FairBoothPreview_show$ref;
export type FairBoothPreview_show = {
    readonly id: string;
    readonly _id: string;
    readonly name: string | null;
    readonly is_fair_booth: boolean | null;
    readonly partner: ({
        readonly name?: string | null;
        readonly href?: string | null;
        readonly id?: string;
        readonly _id?: string;
        readonly __id?: string;
        readonly profile?: ({
            readonly _id: string;
            readonly is_followed: boolean | null;
        }) | null;
    }) | null;
    readonly fair: ({
        readonly name: string | null;
    }) | null;
    readonly cover_image: ({
        readonly url: string | null;
    }) | null;
    readonly location: ({
        readonly display: string | null;
    }) | null;
    readonly artworks_connection: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly " $fragmentRefs": GenericGrid_artworks$ref;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": FairBoothPreview_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
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
    v0,
    v1,
    v2,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_fair_booth",
      "args": null,
      "storageKey": null
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
        v3,
        {
          "kind": "InlineFragment",
          "type": "ExternalPartner",
          "selections": [
            v2
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            v2,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "href",
              "args": null,
              "storageKey": null
            },
            v0,
            v1,
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "profile",
              "storageKey": null,
              "args": null,
              "concreteType": "Profile",
              "plural": false,
              "selections": [
                v1,
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "is_followed",
                  "args": null,
                  "storageKey": null
                },
                v3
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
        v2,
        v3
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "cover_image",
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
        },
        v3
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworks_connection",
      "storageKey": "artworks_connection(first:4)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 4,
          "type": "Int"
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
                },
                v3
              ]
            }
          ]
        }
      ]
    },
    v3
  ]
};
})();
(node as any).hash = '923b0e0221c6a7d56c198686b6c57b3e';
export default node;
