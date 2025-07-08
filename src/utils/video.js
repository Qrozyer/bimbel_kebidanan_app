// utils/video.js

/**
 * Konversi URL YouTube menjadi embed URL.
 * Mendukung bentuk watch?v= dan youtu.be/
 * 
 * @param {string} url
 * @returns {string|null}
 */
export const convertToEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  const regExp = /^.*(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
};
