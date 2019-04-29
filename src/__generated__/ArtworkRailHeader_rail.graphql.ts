/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ArtworkRailHeader_rail$ref: unique symbol;
export type ArtworkRailHeader_rail$ref = typeof _ArtworkRailHeader_rail$ref;
export type ArtworkRailHeader_rail = {
    readonly title: string | null;
    readonly key: string | null;
    readonly context: ({
        readonly artist?: ({
            readonly gravityID: string;
        }) | null;
        readonly based_on?: ({
            readonly name: string | null;
        }) | null;
    }) | null;
    readonly " $refType": ArtworkRailHeader_rail$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtworkRailHeader_rail",
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
        v0,
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextRelatedArtist",
          "selections": [
            {
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
                  "name": "gravityID",
                  "args": null,
                  "storageKey": null
                },
                v0
              ]
            },
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
              ]
            }
          ]
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = 'ed60c0a7afa22d89b838d4deab5bd106';
export default node;
