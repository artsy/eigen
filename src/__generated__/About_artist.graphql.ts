/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Articles_articles$ref } from "./Articles_articles.graphql";
import { Biography_artist$ref } from "./Biography_artist.graphql";
import { RelatedArtists_artists$ref } from "./RelatedArtists_artists.graphql";
declare const _About_artist$ref: unique symbol;
export type About_artist$ref = typeof _About_artist$ref;
export type About_artist = {
    readonly has_metadata: boolean | null;
    readonly is_display_auction_link: boolean | null;
    readonly gravityID: string;
    readonly related_artists: ReadonlyArray<({
        readonly " $fragmentRefs": RelatedArtists_artists$ref;
    }) | null> | null;
    readonly articles: ReadonlyArray<({
        readonly " $fragmentRefs": Articles_articles$ref;
    }) | null> | null;
    readonly " $fragmentRefs": Biography_artist$ref;
    readonly " $refType": About_artist$ref;
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
      "name": "gravityID",
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
(node as any).hash = 'fd32ce5fe60123b9bf29932fe861bcd4';
export default node;
