/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2_fair = {
    readonly articles: {
        readonly edges: ReadonlyArray<{
            readonly __typename: string;
        } | null> | null;
    } | null;
    readonly marketingCollections: ReadonlyArray<{
        readonly __typename: string;
    } | null>;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair" | "Fair2Editorial_fair" | "Fair2Collections_fair">;
    readonly " $refType": "Fair2_fair";
};
export type Fair2_fair$data = Fair2_fair;
export type Fair2_fair$key = {
    readonly " $data"?: Fair2_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "__typename",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "Fair2_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "articles",
      "name": "articlesConnection",
      "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "PUBLISHED_AT_DESC"
        }
      ],
      "concreteType": "ArticleConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArticleEdge",
          "plural": true,
          "selections": (v0/*: any*/)
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "marketingCollections",
      "storageKey": "marketingCollections(size:4)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 4
        }
      ],
      "concreteType": "MarketingCollection",
      "plural": true,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Header_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Editorial_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Collections_fair",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'b3405559e962fd4974ccbd337a541e71';
export default node;
