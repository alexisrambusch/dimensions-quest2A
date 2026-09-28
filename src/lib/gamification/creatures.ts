// Real wild animals for the shop's mystery-orb gacha, each paired with a
// genuine fun fact — zero third-party characters or trademarks, matching
// the rest of the app's zero-asset emoji visual language (see
// components/manipulatives/icons.ts). Grouped by the habitat/region they're
// actually found in, with a mix of all four rarity tiers per habitat.
//
// `imagePath` is filled in from creatureImages.json, populated by
// scripts/download-creature-images.ts once a real photo has been downloaded
// for that code — a missing entry falls back to the emoji icon.

import creatureImages from "./creatureImages.json";

export type CreatureRarity = "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY";

export type CreatureHabitat = "FOREST" | "GRASSLAND" | "OCEAN" | "ARCTIC" | "DESERT" | "RAINFOREST" | "MOUNTAIN" | "WETLAND";

export interface CreatureDef {
  code: string;
  name: string;
  description: string;
  icon: string;
  rarity: CreatureRarity;
  habitat: CreatureHabitat;
  imagePath: string | null;
}

export const HABITAT_LABELS: Record<CreatureHabitat, string> = {
  FOREST: "Forest",
  GRASSLAND: "Grassland & Savanna",
  OCEAN: "Ocean",
  ARCTIC: "Arctic & Tundra",
  DESERT: "Desert",
  RAINFOREST: "Rainforest",
  MOUNTAIN: "Mountains",
  WETLAND: "Wetlands & Rivers",
};

export const HABITAT_ICONS: Record<CreatureHabitat, string> = {
  FOREST: "🌲",
  GRASSLAND: "🌾",
  OCEAN: "🌊",
  ARCTIC: "❄️",
  DESERT: "🏜️",
  RAINFOREST: "🌴",
  MOUNTAIN: "⛰️",
  WETLAND: "🪷",
};

export const HABITAT_ORDER: CreatureHabitat[] = ["FOREST", "GRASSLAND", "OCEAN", "ARCTIC", "DESERT", "RAINFOREST", "MOUNTAIN", "WETLAND"];

const IMAGES = creatureImages as Record<string, string>;

function creature(
  code: string,
  name: string,
  icon: string,
  rarity: CreatureRarity,
  habitat: CreatureHabitat,
  description: string,
): CreatureDef {
  return { code, name, icon, rarity, habitat, description, imagePath: IMAGES[code] ?? null };
}

export const CREATURES: CreatureDef[] = [
  // ── Forest ──────────────────────────────────────────────────────────
  creature("red_fox", "Red Fox", "🦊", "COMMON", "FOREST", "A fox's whiskers are as wide as its body, helping it judge whether a gap is too narrow to fit through."),
  creature("squirrel", "Squirrel", "🐿️", "COMMON", "FOREST", "Squirrels bury thousands of nuts each year and forget where many of them are — accidentally planting new trees."),
  creature("owl", "Great Horned Owl", "🦉", "COMMON", "FOREST", "An owl can turn its head almost all the way around — up to 270 degrees — without hurting itself."),
  creature("raccoon", "Raccoon", "🦝", "COMMON", "FOREST", "A raccoon's front paws have so many nerve endings that it can practically \"see\" with its sense of touch."),
  creature("black_bear", "Black Bear", "🐻", "UNCOMMON", "FOREST", "A black bear's sense of smell is about seven times stronger than a bloodhound's."),
  creature("white_tailed_deer", "White-Tailed Deer", "🦌", "UNCOMMON", "FOREST", "A white-tailed deer can run up to 30 miles per hour and clear a 10-foot jump in a single bound."),
  creature("gray_wolf", "Gray Wolf", "🐺", "RARE", "FOREST", "A wolf pack is usually just a family — a mother, father, and their pups — working together, not fighting for control."),
  creature("koala", "Koala", "🐨", "RARE", "FOREST", "Koalas sleep up to 20 hours a day because their eucalyptus-leaf diet gives them very little energy."),
  creature("giant_panda", "Giant Panda", "🐼", "LEGENDARY", "FOREST", "A giant panda can eat up to 40 pounds of bamboo every single day."),

  // ── Grassland & Savanna ─────────────────────────────────────────────
  creature("honeybee", "Honeybee", "🐝", "COMMON", "GRASSLAND", "Honeybees \"dance\" in figure-eight patterns to tell each other exactly where to find the best flowers."),
  creature("hedgehog", "Hedgehog", "🦔", "COMMON", "GRASSLAND", "A hedgehog has over 5,000 spines, but each one is soft right at the base near its skin."),
  creature("zebra", "Zebra", "🦓", "COMMON", "GRASSLAND", "Every zebra's stripe pattern is unique, just like a human fingerprint."),
  creature("bison", "American Bison", "🦬", "COMMON", "GRASSLAND", "Despite weighing over 2,000 pounds, a bison can run up to 35 miles per hour and jump nearly 6 feet straight up."),
  creature("giraffe", "Giraffe", "🦒", "COMMON", "GRASSLAND", "A giraffe's heart is about 2 feet long and pumps hard enough to push blood all the way up its neck to its brain."),
  creature("cheetah", "Cheetah", "🐆", "UNCOMMON", "GRASSLAND", "A cheetah can go from 0 to 60 miles per hour in about three seconds — faster than most sports cars."),
  creature("elephant", "African Elephant", "🐘", "UNCOMMON", "GRASSLAND", "An elephant's trunk has more than 40,000 muscles in it — humans have about 600 in their entire body."),
  creature("lion", "Lion", "🦁", "RARE", "GRASSLAND", "A lion's roar is so powerful it can be heard from up to 5 miles away."),
  creature("kangaroo", "Kangaroo", "🦘", "RARE", "GRASSLAND", "A kangaroo can't hop backward — its powerful tail and legs only work for moving forward."),
  creature("rhino", "Rhinoceros", "🦏", "LEGENDARY", "GRASSLAND", "A rhino's horn is made of keratin, the same protein found in human hair and fingernails."),

  // ── Ocean ───────────────────────────────────────────────────────────
  creature("sea_otter", "Sea Otter", "🦦", "COMMON", "OCEAN", "Sea otters hold hands while floating and sleeping so ocean currents don't carry them apart."),
  creature("dolphin", "Dolphin", "🐬", "COMMON", "OCEAN", "Dolphins call each other with unique \"name\" whistles that other dolphins recognize and respond to."),
  creature("octopus", "Octopus", "🐙", "COMMON", "OCEAN", "An octopus has three hearts and blue blood, and can squeeze through any gap bigger than its beak."),
  creature("sea_turtle", "Sea Turtle", "🐢", "COMMON", "OCEAN", "A sea turtle can hold its breath for hours by slowing its heartbeat to just a few beats per minute."),
  creature("great_white_shark", "Great White Shark", "🦈", "UNCOMMON", "OCEAN", "A great white shark can detect a single drop of blood in 25 gallons of water and smell it from a mile away."),
  creature("orca", "Orca", "🐋", "RARE", "OCEAN", "Orcas, also called killer whales, are actually the largest member of the dolphin family."),
  creature("blue_whale", "Blue Whale", "🐳", "LEGENDARY", "OCEAN", "The blue whale is the largest animal ever known to have lived — even bigger than the biggest dinosaurs."),

  // ── Arctic & Tundra ─────────────────────────────────────────────────
  creature("snowy_owl", "Snowy Owl", "🦉", "COMMON", "ARCTIC", "Unlike most owls, snowy owls are awake and hunt during the day as well as at night."),
  creature("arctic_fox", "Arctic Fox", "🦊", "COMMON", "ARCTIC", "An arctic fox's fur changes color with the seasons — white in winter snow and brown in summer tundra."),
  creature("snowshoe_hare", "Snowshoe Hare", "🐇", "COMMON", "ARCTIC", "A snowshoe hare's huge back feet act like snowshoes, spreading its weight so it doesn't sink into deep snow."),
  creature("reindeer", "Reindeer", "🦌", "UNCOMMON", "ARCTIC", "Reindeer are the only deer species where both males and females grow antlers."),
  creature("polar_bear", "Polar Bear", "🐻‍❄️", "UNCOMMON", "ARCTIC", "A polar bear's fur looks white but is actually clear — its skin underneath is black to soak up the sun's heat."),
  creature("walrus", "Walrus", "🦭", "RARE", "ARCTIC", "A walrus can slow its own heartbeat to survive icy water and uses its tusks to haul its huge body onto the ice."),
  creature("emperor_penguin", "Emperor Penguin", "🐧", "LEGENDARY", "ARCTIC", "Emperor penguins can dive deeper than 1,800 feet and hold their breath for over 20 minutes."),

  // ── Desert ──────────────────────────────────────────────────────────
  creature("desert_tortoise", "Desert Tortoise", "🐢", "COMMON", "DESERT", "A desert tortoise can go up to a year without drinking water, storing it in a special bladder."),
  creature("roadrunner", "Roadrunner", "🐦", "COMMON", "DESERT", "A roadrunner can sprint up to 20 miles per hour and rarely flies, preferring to chase prey on foot."),
  creature("camel", "Camel", "🐪", "COMMON", "DESERT", "A camel's hump doesn't store water — it stores fat, which its body can turn into water and energy."),
  creature("fennec_fox", "Fennec Fox", "🦊", "UNCOMMON", "DESERT", "A fennec fox's giant ears — the largest of any fox relative to its body — help it release heat and hear prey moving underground."),
  creature("scorpion", "Scorpion", "🦂", "UNCOMMON", "DESERT", "Scorpions glow bright blue-green under ultraviolet light, though scientists still aren't fully sure why."),
  creature("gila_monster", "Gila Monster", "🦎", "RARE", "DESERT", "A Gila monster can eat a third of its body weight in one meal and then go months without eating again."),
  creature("rattlesnake", "Sidewinder Rattlesnake", "🐍", "LEGENDARY", "DESERT", "A sidewinder moves in a sideways, looping motion that leaves J-shaped tracks and keeps most of its body off the hot sand."),

  // ── Rainforest ──────────────────────────────────────────────────────
  creature("toucan", "Toucan", "🦜", "COMMON", "RAINFOREST", "A toucan's huge, colorful beak looks heavy but is actually very light — made of a foam-like bone covered in keratin."),
  creature("poison_dart_frog", "Poison Dart Frog", "🐸", "COMMON", "RAINFOREST", "Many poison dart frogs get their toxins from the ants and insects they eat — raised on a different diet, they aren't poisonous at all."),
  creature("sloth", "Sloth", "🦥", "COMMON", "RAINFOREST", "A sloth moves so slowly that algae grows right on its fur, helping it blend into the rainforest canopy."),
  creature("chameleon", "Chameleon", "🦎", "UNCOMMON", "RAINFOREST", "A chameleon's eyes can rotate independently, letting it look in two different directions at once."),
  creature("jaguar", "Jaguar", "🐆", "UNCOMMON", "RAINFOREST", "A jaguar has the strongest bite of any big cat, powerful enough to pierce a turtle's shell or a crocodile's skull."),
  creature("orangutan", "Orangutan", "🦧", "RARE", "RAINFOREST", "Orangutans share about 97% of their DNA with humans and are known for using tools like sticks to fish termites out of logs."),
  creature("harpy_eagle", "Harpy Eagle", "🦅", "LEGENDARY", "RAINFOREST", "A harpy eagle's talons can be as long as a grizzly bear's claws, strong enough to snatch a monkey right out of the trees."),
  creature("bengal_tiger", "Bengal Tiger", "🐯", "LEGENDARY", "RAINFOREST", "No two tigers have the same stripe pattern — even the stripes on their skin match their fur, like a fingerprint."),

  // ── Mountains ───────────────────────────────────────────────────────
  creature("mountain_goat", "Mountain Goat", "🐐", "COMMON", "MOUNTAIN", "A mountain goat can climb nearly vertical cliffs thanks to hooves with a hard outer edge and a soft, grippy center."),
  creature("golden_eagle", "Golden Eagle", "🦅", "COMMON", "MOUNTAIN", "A golden eagle can spot a rabbit from nearly 2 miles away thanks to eyesight several times sharper than a human's."),
  creature("bighorn_sheep", "Bighorn Sheep", "🐏", "COMMON", "MOUNTAIN", "A bighorn sheep's curled horns can weigh up to 30 pounds — more than all the bones in its body combined."),
  creature("alpaca", "Alpaca", "🦙", "UNCOMMON", "MOUNTAIN", "Alpacas hum to communicate with each other and their handlers, usually as a sign of curiosity or mild worry."),
  creature("snow_leopard", "Snow Leopard", "🐆", "RARE", "MOUNTAIN", "A snow leopard can leap more than 30 feet in a single bound — about the length of a school bus."),
  creature("yak", "Himalayan Yak", "🐃", "LEGENDARY", "MOUNTAIN", "A yak's thick double coat lets it survive temperatures far below freezing high in the Himalayan mountains."),
  creature("peregrine_falcon", "Peregrine Falcon", "🦅", "LEGENDARY", "MOUNTAIN", "A peregrine falcon can dive at over 240 miles per hour, making it the fastest animal on Earth."),

  // ── Wetlands & Rivers ───────────────────────────────────────────────
  creature("beaver", "Beaver", "🦫", "COMMON", "WETLAND", "A beaver's front teeth are bright orange because they're reinforced with iron, strong enough to chew through trees."),
  creature("flamingo", "Flamingo", "🦩", "COMMON", "WETLAND", "Flamingos are actually born gray — they turn pink from pigments in the shrimp and algae they eat."),
  creature("mallard", "Mallard Duck", "🦆", "COMMON", "WETLAND", "A duck's feathers are naturally waterproof thanks to an oil it spreads on them with its beak while preening."),
  creature("river_otter", "River Otter", "🦦", "UNCOMMON", "WETLAND", "A river otter can hold its breath underwater for up to 8 minutes while hunting for fish."),
  creature("alligator", "American Alligator", "🐊", "RARE", "WETLAND", "An alligator's bite is one of the strongest of any animal, but the muscles that open its jaw are so weak a person could hold it shut."),
  creature("hippo", "Hippopotamus", "🦛", "LEGENDARY", "WETLAND", "Despite living in rivers, hippos can't actually swim — they walk or bounce along the riverbed."),
];

export const RARITY_WEIGHTS: Record<CreatureRarity, number> = {
  COMMON: 45,
  UNCOMMON: 30,
  RARE: 18,
  LEGENDARY: 7,
};
