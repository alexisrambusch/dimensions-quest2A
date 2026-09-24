// Real wild animals for the shop's mystery-orb gacha, each paired with a
// genuine fun fact — zero third-party characters or trademarks, matching
// the rest of the app's zero-asset emoji visual language (see
// components/manipulatives/icons.ts).

export type CreatureRarity = "COMMON" | "RARE" | "LEGENDARY";

export interface CreatureDef {
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: CreatureRarity;
}

export const CREATURES: CreatureDef[] = [
  // Common — 10, make up the bulk of pulls
  { code: "red_fox", name: "Red Fox", description: "A fox's whiskers are as wide as its body, helping it judge whether a gap is too narrow to fit through.", icon: "🦊", rarity: "COMMON" },
  { code: "honeybee", name: "Honeybee", description: "Honeybees \"dance\" in figure-eight patterns to tell each other exactly where to find the best flowers.", icon: "🐝", rarity: "COMMON" },
  { code: "squirrel", name: "Squirrel", description: "Squirrels bury thousands of nuts each year and forget where many of them are — accidentally planting new trees.", icon: "🐿️", rarity: "COMMON" },
  { code: "sea_otter", name: "Sea Otter", description: "Sea otters hold hands while floating and sleeping so ocean currents don't carry them apart.", icon: "🦦", rarity: "COMMON" },
  { code: "owl", name: "Owl", description: "An owl can turn its head almost all the way around — up to 270 degrees — without hurting itself.", icon: "🦉", rarity: "COMMON" },
  { code: "rabbit", name: "Rabbit", description: "A rabbit's teeth never stop growing, so it has to gnaw constantly to keep them worn down.", icon: "🐰", rarity: "COMMON" },
  { code: "turtle", name: "Turtle", description: "Some giant tortoises can live for more than 150 years.", icon: "🐢", rarity: "COMMON" },
  { code: "hedgehog", name: "Hedgehog", description: "A hedgehog has over 5,000 spines, but each one is soft right at the base near its skin.", icon: "🦔", rarity: "COMMON" },
  { code: "flamingo", name: "Flamingo", description: "Flamingos are actually born gray — they turn pink from pigments in the shrimp and algae they eat.", icon: "🦩", rarity: "COMMON" },
  { code: "beaver", name: "Beaver", description: "A beaver's front teeth are bright orange because they're reinforced with iron, strong enough to chew through trees.", icon: "🦫", rarity: "COMMON" },

  // Rare — 6, a noticeably better pull
  { code: "giant_panda", name: "Giant Panda", description: "A giant panda can eat up to 40 pounds of bamboo every single day.", icon: "🐼", rarity: "RARE" },
  { code: "koala", name: "Koala", description: "Koalas sleep up to 20 hours a day because their eucalyptus-leaf diet gives them very little energy.", icon: "🐨", rarity: "RARE" },
  { code: "octopus", name: "Octopus", description: "An octopus has three hearts and blue blood, and can squeeze through any gap bigger than its beak.", icon: "🐙", rarity: "RARE" },
  { code: "snow_leopard", name: "Snow Leopard", description: "A snow leopard can leap more than 30 feet in a single bound — about the length of a school bus.", icon: "🐆", rarity: "RARE" },
  { code: "kangaroo", name: "Kangaroo", description: "A kangaroo can't hop backward — its powerful tail and legs only work for moving forward.", icon: "🦘", rarity: "RARE" },
  { code: "chameleon", name: "Chameleon", description: "A chameleon's eyes can rotate independently, letting it look in two different directions at once.", icon: "🦎", rarity: "RARE" },

  // Legendary — 3, the rarest pulls
  { code: "bengal_tiger", name: "Bengal Tiger", description: "No two tigers have the same stripe pattern — even the stripes on their skin match their fur, like a fingerprint.", icon: "🐯", rarity: "LEGENDARY" },
  { code: "blue_whale", name: "Blue Whale", description: "The blue whale is the largest animal ever known to have lived — even bigger than the biggest dinosaurs.", icon: "🐳", rarity: "LEGENDARY" },
  { code: "peregrine_falcon", name: "Peregrine Falcon", description: "A peregrine falcon can dive at over 240 miles per hour, making it the fastest animal on Earth.", icon: "🦅", rarity: "LEGENDARY" },
];

export const RARITY_WEIGHTS: Record<CreatureRarity, number> = {
  COMMON: 70,
  RARE: 25,
  LEGENDARY: 5,
};
