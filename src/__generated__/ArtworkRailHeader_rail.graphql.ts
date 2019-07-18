/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkRailHeader_rail$ref: unique symbol;
export type ArtworkRailHeader_rail$ref = typeof _ArtworkRailHeader_rail$ref;
export type ArtworkRailHeader_rail = {
    readonly title: string | null;
    readonly key: string | null;
    readonly context: ({
        readonly artist?: {
            readonly slug: string;
            readonly internalID: string;
        } | null;
        readonly based_on?: {
            readonly name: string | null;
        } | null;
    } & ({
        readonly artist: {
            readonly slug: string;
            readonly internalID: string;
        } | null;
        readonly based_on: {
            readonly name: string | null;
        } | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
    readonly " $refType": ArtworkRailHeader_rail$ref;
};



const node: ReaderFragment = {
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
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
                }
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
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'd5b1f07a1d2dbba9edc5831e8c733ecf';
export default node;
