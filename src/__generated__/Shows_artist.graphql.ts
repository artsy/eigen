/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { SmallList_shows$ref } from "./SmallList_shows.graphql";
import { VariableSizeShowsList_shows$ref } from "./VariableSizeShowsList_shows.graphql";
declare const _Shows_artist$ref: unique symbol;
export type Shows_artist$ref = typeof _Shows_artist$ref;
export type Shows_artist = {
    readonly current_shows: ReadonlyArray<({
        readonly " $fragmentRefs": VariableSizeShowsList_shows$ref;
    }) | null> | null;
    readonly upcoming_shows: ReadonlyArray<({
        readonly " $fragmentRefs": VariableSizeShowsList_shows$ref;
    }) | null> | null;
    readonly past_small_shows?: ReadonlyArray<({
        readonly " $fragmentRefs": SmallList_shows$ref;
    }) | null> | null;
    readonly past_large_shows?: ReadonlyArray<({
        readonly " $fragmentRefs": VariableSizeShowsList_shows$ref;
    }) | null> | null;
    readonly " $refType": Shows_artist$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "FragmentSpread",
    "name": "VariableSizeShowsList_shows",
    "args": null
  },
  v0
],
v2 = [
  {
    "kind": "Literal",
    "name": "size",
    "value": 20,
    "type": "Int"
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "closed",
    "type": "String"
  }
];
return {
  "kind": "Fragment",
  "name": "Shows_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "isPad",
      "type": "Boolean"
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "current_shows",
      "name": "partner_shows",
      "storageKey": "partner_shows(status:\"running\")",
      "args": [
        {
          "kind": "Literal",
          "name": "status",
          "value": "running",
          "type": "String"
        }
      ],
      "concreteType": "PartnerShow",
      "plural": true,
      "selections": v1
    },
    {
      "kind": "LinkedField",
      "alias": "upcoming_shows",
      "name": "partner_shows",
      "storageKey": "partner_shows(status:\"upcoming\")",
      "args": [
        {
          "kind": "Literal",
          "name": "status",
          "value": "upcoming",
          "type": "String"
        }
      ],
      "concreteType": "PartnerShow",
      "plural": true,
      "selections": v1
    },
    v0,
    {
      "kind": "Condition",
      "passingValue": true,
      "condition": "isPad",
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "past_large_shows",
          "name": "partner_shows",
          "storageKey": "partner_shows(size:20,status:\"closed\")",
          "args": v2,
          "concreteType": "PartnerShow",
          "plural": true,
          "selections": v1
        }
      ]
    },
    {
      "kind": "Condition",
      "passingValue": false,
      "condition": "isPad",
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "past_small_shows",
          "name": "partner_shows",
          "storageKey": "partner_shows(size:20,status:\"closed\")",
          "args": v2,
          "concreteType": "PartnerShow",
          "plural": true,
          "selections": [
            {
              "kind": "FragmentSpread",
              "name": "SmallList_shows",
              "args": null
            },
            v0
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '588c371cc29143140554481da8e4570a';
export default node;
