/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type HeroUnits_hero_units = ReadonlyArray<{
        readonly __id: string;
        readonly href: string | null;
        readonly title: string | null;
        readonly heading: string | null;
        readonly narrow_image_url: string | null;
        readonly wide_image_url: string | null;
    }>;



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "HeroUnits_hero_units",
  "type": "HomePageHeroUnit",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
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
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "heading",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "narrow_image_url",
      "name": "background_image_url",
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "NARROW",
          "type": "HomePageHeroUnitImageVersion"
        }
      ],
      "storageKey": "background_image_url(version:\"NARROW\")"
    },
    {
      "kind": "ScalarField",
      "alias": "wide_image_url",
      "name": "background_image_url",
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "WIDE",
          "type": "HomePageHeroUnitImageVersion"
        }
      ],
      "storageKey": "background_image_url(version:\"WIDE\")"
    }
  ],
  "idField": "__id"
};
(node as any).hash = '3c5a06f04a69b982da948725f333c9ed';
export default node;
