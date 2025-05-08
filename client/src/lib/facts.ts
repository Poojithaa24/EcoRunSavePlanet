export interface EcoFact {
  id: number;
  title: string;
  content: string;
  category: 'recycling' | 'conservation' | 'pollution' | 'energy' | 'general';
}

export const ecoFacts: EcoFact[] = [
  {
    id: 1,
    title: "Plastic Bottles",
    content: "It takes up to 450 years for a plastic bottle to decompose in the environment.",
    category: "pollution"
  },
  {
    id: 2,
    title: "Paper Recycling",
    content: "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 380 gallons of oil.",
    category: "recycling"
  },
  {
    id: 3,
    title: "Metal Recycling",
    content: "Aluminum can be recycled indefinitely without losing quality, and recycling it uses 95% less energy than producing new aluminum.",
    category: "recycling"
  },
  {
    id: 4,
    title: "Solar Energy",
    content: "The amount of solar energy that reaches Earth's surface in one hour could meet global energy needs for an entire year.",
    category: "energy"
  },
  {
    id: 5,
    title: "Ocean Pollution",
    content: "About 8 million metric tons of plastic enter our oceans each year, which is like emptying a garbage truck of plastic into the ocean every minute.",
    category: "pollution"
  },
  {
    id: 6,
    title: "Tree Benefits",
    content: "A single mature tree can absorb up to 48 pounds of carbon dioxide per year and release enough oxygen for two people.",
    category: "conservation"
  },
  {
    id: 7,
    title: "Electronic Waste",
    content: "Only about 20% of electronic waste is recycled globally. The rest ends up in landfills or is incinerated.",
    category: "recycling"
  },
  {
    id: 8,
    title: "Water Conservation",
    content: "Taking a 5-minute shower instead of a bath can save up to 100 gallons of water per month.",
    category: "conservation"
  },
  {
    id: 9,
    title: "Air Pollution",
    content: "Air pollution causes about 7 million premature deaths worldwide every year.",
    category: "pollution"
  },
  {
    id: 10,
    title: "Renewable Energy",
    content: "Renewable energy sources like wind, solar, and hydropower produce little to no global warming emissions.",
    category: "energy"
  },
  {
    id: 11,
    title: "Plastic Bags",
    content: "The average plastic bag is used for just 12 minutes but can take up to 1,000 years to decompose.",
    category: "pollution"
  },
  {
    id: 12,
    title: "Glass Recycling",
    content: "Glass can be recycled endlessly without loss in quality or purity.",
    category: "recycling"
  },
  {
    id: 13,
    title: "Food Waste",
    content: "About one-third of all food produced globally is wasted, which contributes to 8% of total global greenhouse gas emissions.",
    category: "general"
  },
  {
    id: 14,
    title: "Energy Conservation",
    content: "LED lights use up to 90% less energy than incandescent bulbs and can last up to 25 times longer.",
    category: "energy"
  },
  {
    id: 15,
    title: "Wildlife Protection",
    content: "Over 1 million species are at risk of extinction due to human activities.",
    category: "conservation"
  }
];

export const getRandomFact = (): EcoFact => {
  const randomIndex = Math.floor(Math.random() * ecoFacts.length);
  return ecoFacts[randomIndex];
};

export const getFactByCategory = (category: EcoFact['category']): EcoFact => {
  const categoryFacts = ecoFacts.filter(fact => fact.category === category);
  const randomIndex = Math.floor(Math.random() * categoryFacts.length);
  return categoryFacts[randomIndex] || getRandomFact();
};
