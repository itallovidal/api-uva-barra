export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateReadingTime(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
