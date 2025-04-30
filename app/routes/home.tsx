import {
  AppBar,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  useTheme,
  type Palette,
} from "@mui/material";
import type { Route } from "./+types/home";
import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { parseCsvProduct, type CsvProduct, type Product } from "./product";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TCGplayer Pull Sheet Tool" },
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
    <Stack>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TCGplayer Pull Sheet Tool
          </Typography>
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
        </Toolbar>
      </AppBar>
      {products.length > 0 && (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Product Line</TableCell>
              <TableCell align="right">Set</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Main</TableCell>
              <TableCell>Photo URL</TableCell>
              <TableCell>Set Release Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => {
              const cellStyle = getCellStyle(product.condition, theme.palette);
              const rowStyle = {
                backgroundColor:
                  index % 2 === 0 ? theme.palette.action.hover : "inherit",
              };

              return (
                <TableRow key={index} sx={rowStyle}>
                  <TableCell sx={cellStyle}>{product.productLine}</TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {product.set}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {product.quantity}
                  </TableCell>
                  <TableCell sx={cellStyle}>{product.displayName}</TableCell>
                  <TableCell sx={cellStyle}>
                    {product.displayCondition}
                  </TableCell>
                  <TableCell sx={cellStyle}>{product.main}</TableCell>
                  <TableCell sx={cellStyle}>{product.photoUrl}</TableCell>
                  <TableCell sx={cellStyle}>{product.setReleaseDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
}

function getCellStyle(
  condition: string,
  palette: Palette
): { color: string; fontWeight: string | number; fontStyle: string } {
  let fontWeight = 200;

  if (condition.includes("Holo") || condition.includes("Foil"))
    fontWeight += 200;

  if (condition.includes("1st Edition")) fontWeight += 200;

  if (condition.includes("Reverse Holofoil")) fontWeight -= 200;

  const fontStyle = condition.includes("Reverse Holofoil")
    ? "italic"
    : "inherit";

  const color = condition.startsWith("Near Mint")
    ? palette.text.primary
    : condition.startsWith("Lightly Played")
    ? palette.primary.main
    : condition.startsWith("Moderately Played")
    ? palette.success.main
    : condition.startsWith("Heavily Played")
    ? palette.warning.main
    : condition.startsWith("Damaged")
    ? palette.error.main
    : condition.startsWith("Unopened")
    ? palette.info.main
    : palette.text.primary;

  return { color, fontWeight, fontStyle };
}
