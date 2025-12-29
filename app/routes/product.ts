export type Condition =
  | "Near Mint"
  | "Lightly Played"
  | "Moderately Played"
  | "Heavily Played"
  | "Damaged"
  | "Unopened"
  | "Unknown";

export interface CsvProduct {
  "Product Line": string;
  "Product Name": string;
  Condition: string;
  Number: string;
  Set: string;
  Rarity: string;
  Quantity: string;
  "Main Photo URL": string;
  "Set Release Date": string;
}

export interface Product {
  productLine: string;
  productName: string;
  displayName: string;
  condition: string;
  displayCondition: Condition;
  printing: string;
  number: string;
  set: string;
  rarity: string;
  quantity: number;
  mainPhotoUrl: string;
  setReleaseDate: string;
}

export const conditions: Condition[] = [
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
  "Unopened",
];

export function parseCsvProduct(csvProduct: CsvProduct): Product {
  const { displayCondition, printing } = parseConditionAndPrinting(
    csvProduct.Condition
  );

  return {
    productLine: csvProduct["Product Line"],
    productName: csvProduct["Product Name"],
    displayName: buildDisplayName(
      csvProduct["Product Name"],
      csvProduct.Number,
      printing,
      csvProduct.Rarity
    ),
    condition: csvProduct["Condition"],
    displayCondition: displayCondition,
    printing: printing,
    number: csvProduct.Number,
    set: csvProduct.Set,
    rarity: csvProduct.Rarity,
    quantity: parseInt(csvProduct.Quantity, 10),
    mainPhotoUrl: csvProduct["Main Photo URL"],
    setReleaseDate: csvProduct["Set Release Date"],
  };
}

export function parseConditionAndPrinting(condition: string): {
  displayCondition: Condition;
  printing: string;
} {
  const foundCondition = conditions.find((c) => condition?.startsWith(c));
  const foundPrinting = condition.substring(foundCondition?.length || 0).trim();
  return {
    displayCondition: foundCondition || "Unknown",
    printing: foundPrinting,
  };
}

export function buildDisplayName(
  productName: string,
  number: string,
  printing: string,
  rarity: string
): string {
  if (!productName.includes(number))
    return `${productName} - ${number} - ${rarity} ${printing}`;
  return `${productName} - ${rarity} ${printing}`;
}
