import base64 from 'base-64';

export const safeEncode = (input: string): string => {
  return base64.encode(input);
};

export const generateArticleId = (
  sourceName: string | null,
  publishedAt: string | null,
  index: number
): string => {
  return encodeURIComponent(sourceName || `source-${index}`) + '-' + encodeURIComponent(publishedAt || `time-${index}`);
};