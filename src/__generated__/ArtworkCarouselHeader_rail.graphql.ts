/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ArtworkCarouselHeader_rail = {
    readonly title: string | null;
    readonly key: string | null;
    readonly context: ({
        readonly __typename: "HomePageModuleContextFollowedArtist";
        readonly artist: ({
            readonly _id: string;
            readonly id: string;
        }) | null;
    } | {
        readonly __typename: "HomePageModuleContextRelatedArtist";
        readonly based_on: ({
            readonly name: string | null;
        }) | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "artist",
  "storageKey": null,
  "args": null,
  "concreteType": "Artist",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    v0
  ],
  "idField": "__id"
};
return {
  "kind": "Fragment",
  "name": "ArtworkCarouselHeader_rail",
  "type": "HomePageArtworkModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
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
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "__typename",
          "args": null,
          "storageKey": null
        },
        v0,
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextRelatedArtist",
          "selections": [
            v1,
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "based_on",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                },
                v0
              ],
              "idField": "__id"
            }
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextFollowedArtist",
          "selections": [
            v1
          ]
        }
      ],
      "idField": "__id"
    },
    v0
  ],
  "idField": "__id"
};
})();
(node as any).hash = '6f3dd39ce9e202bb0db432281860fbeb';
export default node;
