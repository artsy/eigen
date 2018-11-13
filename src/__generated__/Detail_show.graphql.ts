/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Artists_show$ref } from "./Artists_show.graphql";
import { Artworks_show$ref } from "./Artworks_show.graphql";
import { LocationMap_location$ref } from "./LocationMap_location.graphql";
import { ShowHeader_show$ref } from "./ShowHeader_show.graphql";
import { Shows_show$ref } from "./Shows_show.graphql";
declare const _Detail_show$ref: unique symbol;
export type Detail_show$ref = typeof _Detail_show$ref;
export type Detail_show = {
    readonly id: string;
    readonly name: string | null;
    readonly description: string | null;
    readonly city: string | null;
    readonly location: ({
        readonly id: string;
        readonly address: string | null;
        readonly address_2: string | null;
        readonly city: string | null;
        readonly state: string | null;
        readonly postal_code: string | null;
        readonly " $fragmentRefs": LocationMap_location$ref;
    }) | null;
    readonly images: ReadonlyArray<({
        readonly id: string | null;
    }) | null> | null;
    readonly nearbyShows: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly id: string;
                readonly name: string | null;
                readonly images: ReadonlyArray<({
                    readonly url: string | null;
                    readonly aspect_ratio: number;
                }) | null> | null;
                readonly partner: ({
                    readonly name?: string | null;
                }) | null;
                readonly location: ({
                    readonly address: string | null;
                    readonly address_2: string | null;
                    readonly state: string | null;
                    readonly postal_code: string | null;
                }) | null;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly status: string | null;
    readonly counts: ({
        readonly artworks: number | null;
        readonly eligible_artworks: any | null;
    }) | null;
    readonly partner: ({
        readonly name?: string | null;
    }) | null;
    readonly " $fragmentRefs": ShowHeader_show$ref & Artworks_show$ref & Artists_show$ref & Shows_show$ref;
    readonly " $refType": Detail_show$ref;
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
  "name": "city",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "address",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "address_2",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "state",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "postal_code",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = [
  v7
],
v9 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": null,
  "plural": false,
  "selections": [
    v6,
    {
      "kind": "InlineFragment",
      "type": "Partner",
      "selections": v8
    },
    {
      "kind": "InlineFragment",
      "type": "ExternalPartner",
      "selections": v8
    }
  ]
};
return {
  "kind": "Fragment",
  "name": "Detail_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ShowHeader_show",
      "args": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        v0,
        v2,
        v3,
        v1,
        v4,
        v5,
        v6,
        {
          "kind": "FragmentSpread",
          "name": "LocationMap_location",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
      "selections": [
        v0
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "nearbyShows",
      "storageKey": "nearbyShows(first:20)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20,
          "type": "Int"
        }
      ],
      "concreteType": "ShowConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ShowEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Show",
              "plural": false,
              "selections": [
                v0,
                v7,
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "images",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": true,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "url",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "aspect_ratio",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
                v9,
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "location",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Location",
                  "plural": false,
                  "selections": [
                    v2,
                    v3,
                    v4,
                    v5,
                    v6
                  ]
                },
                v6
              ]
            }
          ]
        }
      ]
    },
    v7,
    {
      "kind": "FragmentSpread",
      "name": "Artworks_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Artists_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Shows_show",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
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
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "eligible_artworks",
          "args": null,
          "storageKey": null
        }
      ]
    },
    v9,
    v6
  ]
};
})();
(node as any).hash = 'f623a1f1aac1c9d8fdff56134d4840f5';
export default node;
