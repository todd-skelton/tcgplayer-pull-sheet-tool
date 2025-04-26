import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import type { Route } from "./+types/home";
import React, { useRef, useState } from "react";
import Papa from "papaparse";

type Condition =
  | "Near Mint"
  | "Lightly Played"
  | "Moderately Played"
  | "Heavily Played"
  | "Damaged"
  | "Unopened"
  | "Unknown";

interface CsvProduct {
  "Product Line": string;
  "Product Name": string;
  Condition: string;
  Number: string;
  Set: string;
  Rarity: string;
  Quantity: string;
  Main: string;
  "Photo URL": string;
  "Set Release Date": string;
}

interface Product {
  productLine: string;
  productName: string;
  condition: Condition;
  printing: string;
  number: string;
  set: string;
  rarity: string;
  quantity: number;
  main: string;
  photoUrl: string;
  setReleaseDate: string;
}

const conditions: Condition[] = [
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
  "Unopened",
];

function parseConditionAndPrinting(condition: string): {
  condition: Condition;
  printing: string;
} {
  const foundCondition = conditions.find((c) => condition?.startsWith(c));
  const foundPrinting = condition.substring(foundCondition?.length || 0).trim();
  return {
    condition: foundCondition || "Unknown",
    printing: foundPrinting,
  };
}

function parseCsvProduct(csvProduct: CsvProduct): Product {
  const { condition, printing } = parseConditionAndPrinting(
    csvProduct.Condition
  );

  return {
    productLine: csvProduct["Product Line"],
    productName: csvProduct["Product Name"],
    condition: condition,
    printing: printing,
    number: csvProduct.Number,
    set: csvProduct.Set,
    rarity: csvProduct.Rarity,
    quantity: parseInt(csvProduct.Quantity, 10),
    main: csvProduct.Main,
    photoUrl: csvProduct["Photo URL"],
    setReleaseDate: csvProduct["Set Release Date"],
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const products: Product[] = [];
      Papa.parse<CsvProduct>(file, {
        header: true,
        skipEmptyLines: true,
        step: (row) => {
          const csvProduct = row.data;
          if (csvProduct["Product Line"] === "Orders Contained in Pull Sheet:")
            return;
          const product = parseCsvProduct(csvProduct);
          products.push(product);
        },
        complete: () => {
          setProducts(products);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    }
  };
  return (
    <Stack spacing={2}>
      <Typography variant="h4">TCGplayer Pull Sheet Tool</Typography>
      <Button variant="contained" component="label">
        Upload Pull Sheet Export
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          hidden
          onChange={handleFileUpload}
        />
      </Button>
      {products.length > 0 && (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Product Line</TableCell>
              <TableCell>Set</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Printing</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Rarity</TableCell>
              <TableCell>Main</TableCell>
              <TableCell>Photo URL</TableCell>
              <TableCell>Set Release Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => {
              let textColor = theme.palette.text.primary;
              switch (product.condition) {
                case "Near Mint":
                  break;
                case "Lightly Played":
                  textColor = theme.palette.primary.main;
                  break;
                case "Moderately Played":
                  textColor = theme.palette.success.main;
                  break;
                case "Heavily Played":
                  textColor = theme.palette.warning.main;
                  break;
                case "Damaged":
                  textColor = theme.palette.error.main;
                  break;
                case "Unopened":
                  textColor = theme.palette.info.main;
                  break;
                default:
                  textColor = theme.palette.text.primary;
              }
              return (
                <TableRow key={index}>
                  <TableCell sx={{ color: textColor }}>
                    {product.productLine}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>{product.set}</TableCell>
                  <TableCell sx={{ color: textColor }} align="right">
                    {product.quantity}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.productName}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.condition}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.printing}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.number}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.rarity}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.main}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.photoUrl}
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {product.setReleaseDate}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
}
