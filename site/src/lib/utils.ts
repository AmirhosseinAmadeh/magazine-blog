export const faNumber = (n: number) => n.toLocaleString('fa-IR');

export const faDate = (d: Date) =>
  d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' });

// Rough reading time in minutes (~180 words/min), shown in Persian digits.
export const readingTime = (body: string | undefined) => {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return faNumber(Math.max(1, Math.round(words / 180)));
};
