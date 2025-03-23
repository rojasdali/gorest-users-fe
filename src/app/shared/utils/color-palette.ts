export enum ColorName {
  TURQUOISE = 'turquoise',
  GREEN_SEA = 'greenSea',
  EMERALD = 'emerald',
  NEPHRITIS = 'nephritis',
  PETER_RIVER = 'peterRiver',
  BELIZE_HOLE = 'belizeHole',
  AMETHYST = 'amethyst',
  WISTERIA = 'wisteria',
  WET_ASPHALT = 'wetAsphalt',
  MIDNIGHT_BLUE = 'midnightBlue',
  SUNFLOWER = 'sunflower',
  CARROT = 'carrot',
  ALIZARIN = 'alizarin',
  CLOUDS = 'clouds',
  SILVER = 'silver',
}

export const ColorPalette: Record<string, string> = {
  turquoise: '#1abc9c',
  greenSea: '#16a085',
  emerald: '#2ecc71',
  nephritis: '#27ae60',
  peterRiver: '#3498db',
  belizeHole: '#2980b9',
  amethyst: '#9b59b6',
  wisteria: '#8e44ad',
  wetAsphalt: '#34495e',
  midnightBlue: '#2c3e50',
  sunflower: '#f1c40f',
  carrot: '#e67e22',
  alizarin: '#e74c3c',
  clouds: '#ecf0f1',
  silver: '#95a5a6',
};

export const FlatUIColors: string[] = Object.values(ColorPalette);

export function getColorByName(name: keyof typeof ColorPalette): string {
  return ColorPalette[name];
}

export function getRandomColor(): string {
  const colors = Object.values(ColorPalette);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function getColorByIndex(index: number): string {
  const colors = Object.values(ColorPalette);
  const wrappedIndex = index % colors.length;
  return colors[wrappedIndex];
}

export function getColorNameByIndex(index: number): string {
  const colorNames = Object.keys(ColorPalette);
  const wrappedIndex = index % colorNames.length;
  return colorNames[wrappedIndex];
}
