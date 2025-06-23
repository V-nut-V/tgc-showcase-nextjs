export function nestProducts(products) {
  const total = products.length;
  const columns = Math.ceil(Math.sqrt(total)); // number of columns (widest)
  const rows = Math.ceil(total / columns); // number of rows

  const nested = [];
  for (let i = 0; i < rows; i++) {
    const start = i * columns;
    const end = start + columns;
    nested.push(products.slice(start, end));
  }

  return nested;
}