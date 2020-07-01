/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomeHero_homePage = {
    readonly heroUnits: ReadonlyArray<{
        readonly title: string | null;
        readonly subtitle: string | null;
        readonly creditLine: string | null;
        readonly linkText: string | null;
        readonly href: string | null;
        readonly backgroundImageURL: string | null;
    } | null> | null;
    readonly " $refType": "HomeHero_homePage";
};
export type HomeHero_homePage$data = HomeHero_homePage;
export type HomeHero_homePage$key = {
    readonly " $data"?: HomeHero_homePage$data;
    readonly " $fragmentRefs": FragmentRefs<"HomeHero_homePage">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "HomeHero_homePage",
  "type": "HomePage",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "heroImageVersion",
      "type": "HomePageHeroUnitImageVersion",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "heroUnits",
      "storageKey": "heroUnits(platform:\"MOBILE\")",
      "args": [
        {
          "kind": "Literal",
          "name": "platform",
          "value": "MOBILE"
        }
      ],
      "concreteType": "HomePageHeroUnit",
      "plural": true,
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
          "name": "subtitle",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "creditLine",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "linkText",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "backgroundImageURL",
          "args": [
            {
              "kind": "Variable",
              "name": "version",
              "variableName": "heroImageVersion"
            }
          ],
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '8ac1fd8f53214f528b9b93e874a60f65';
export default node;
