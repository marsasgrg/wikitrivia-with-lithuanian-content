import { QueryDefinition, SourceRow } from "./query-definition";
import lithuanianKingsTakingOffice from "./queries/lithuanian-monarchs-taking-office/query";
import lithuanianPMsTakingOffice from "./queries/lithuanian-prime-ministers-taking-office/query";
import lithuanianPresidentsTakingOffice from "./queries/lithuanian-presidents-taking-office/query";

interface DeckDefinition {
  children?: readonly DeckDefinition[];
  frequency: number;
  hidden?: boolean;
  maxYear?: number;
  minYear?: number;
  rowFilter?: (row: SourceRow) => boolean;
  slug: string;
  sources?: readonly QueryDefinition[];
  themeHue?: number;
  title: string;
}

interface Deck extends DeckDefinition {
  children?: readonly Deck[];
  id: string;
  themeHue: number;
}

const DEFAULT_DECK_THEME_HUE = 0;

function deckDefinitionToDeck(
  deckDefinition: DeckDefinition,
  parentSlugPath: readonly string[],
  inheritedThemeHue = DEFAULT_DECK_THEME_HUE,
): Deck {
  const slugPath = [...parentSlugPath, deckDefinition.slug];
  const themeHue = deckDefinition.themeHue ?? inheritedThemeHue;

  return {
    ...deckDefinition,
    id: slugPath.join("-"),
    themeHue,
    children: deckDefinition.children?.map((child) =>
      deckDefinitionToDeck(child, slugPath, themeHue),
    ),
  };
}



function rowHasNobelPrize(
  row: SourceRow,
  options: {
    awardId?: string;
    awardLabel: string;
  },
): boolean {
  if (options.awardId && row.award === options.awardId) {
    return true;
  }

  return row.awardLabel === options.awardLabel;
}

const rootDeckDefinition: DeckDefinition = {
  slug: "all",
  title: "All",
  frequency: 1,
  children: [
    {
      slug: "leaders",
      title: "Leaders",
      themeHue: 180,
      frequency: 1,
      children: [
        {
          slug: "lithuania-pm",
          title: "Lithuania - PMs",
          frequency: 1.4,
          sources: [lithuanianPMsTakingOffice],
        },
        {
          slug: "lithuania-pres",
          title: "Lithuania - Presidents",
          frequency: 1.4,
          sources: [lithuanianPresidentsTakingOffice],
        },
        {
          slug: "lithuania-monarch",
          title: "Lithuania - Monarchs",
          frequency: 1.4,
          sources: [lithuanianKingsTakingOffice],
        },
        {
          slug: "lithuania-including-rulers",
          title: "Lithuania - All",
          frequency: 1.4,
          sources: [lithuanianPMsTakingOffice, lithuanianKingsTakingOffice, lithuanianPresidentsTakingOffice],
        },
      ],
    },
  ],
};

export const rootDeck: Deck = deckDefinitionToDeck(rootDeckDefinition, []);

export const topLevelDecks: readonly Deck[] = rootDeck.children ?? [];

export function collectDecks(node: Deck): Deck[] {
  return [
    node,
    ...(node.children ?? []).flatMap((child) => collectDecks(child)),
  ];
}

export function getAllDeckDefinitions(): Deck[] {
  return collectDecks(rootDeck);
}

export function getDeckBySlugPath(slugPath: readonly string[]): Deck | null {
  if (slugPath.length === 0) {
    return rootDeck;
  }

  let current: Deck | null = null;
  let nodes: readonly Deck[] = rootDeck.children ?? [];

  for (const slug of slugPath) {
    current = nodes.find((node) => node.slug === slug) ?? null;
    if (!current) {
      return null;
    }

    nodes = current.children ?? [];
  }

  return current;
}

export type { Deck, DeckDefinition };
