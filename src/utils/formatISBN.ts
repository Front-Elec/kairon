/**
 * ISBN-13 structure:
 * 978-X-XX-XXXXXX-X
 * prefix · group · publisher · title · check digit
 */
export const formatISBN = (raw: string): string => {
  const digits = raw.replace(/[-\s]/g, "");

  if (digits.length !== 13) {
    return raw;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(
    4,
    6,
  )}-${digits.slice(6, 12)}-${digits.slice(12)}`;
};
