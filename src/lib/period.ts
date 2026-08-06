export function parsePeriod(mes?: string, ano?: string): { month: number; year: number } {
  const now = new Date();
  const monthRaw = Number(mes);
  const month = Number.isInteger(monthRaw) && monthRaw >= 1 && monthRaw <= 12
    ? monthRaw
    : now.getMonth() + 1;
  const year = Number(ano) || now.getFullYear();
  return { month, year };
}
