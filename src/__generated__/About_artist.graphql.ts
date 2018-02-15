/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type About_artist = {
    readonly has_metadata: boolean | null;
    readonly is_display_auction_link: boolean | null;
    readonly id: string;
    readonly related_artists: ReadonlyArray<({
        }) | null> | null;
    readonly articles: ReadonlyArray<({
        }) | null> | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "About_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "has_metadata",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_display_auction_link",
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
    {
      "kind": "FragmentSpread",
      "name": "Biography_artist",
      "args": null
    },
    {
      "kind": "LinkedField",
      "alias": "related_artists",
      "name": "artists",
      "storageKey": "artists(size:16)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 16,
          "type": "Int"
        }
      ],
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "RelatedArtists_artists",
          "args": null
        },
        v0
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "articles",
      "storageKey": null,
      "args": null,
      "concreteType": "Article",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "Articles_articles",
          "args": null
        },
        v0
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '0d92b625a9f137deef4539f44df5d64c';
export default node;
