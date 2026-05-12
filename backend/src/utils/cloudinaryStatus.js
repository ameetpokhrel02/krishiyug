const PLACEHOLDER_VALUES = new Set([
  'your-cloud-name',
  'your-api-key',
  'your-api-secret',
  '',
  undefined,
  null,
]);

export const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return !PLACEHOLDER_VALUES.has(cloudName) &&
    !PLACEHOLDER_VALUES.has(apiKey) &&
    !PLACEHOLDER_VALUES.has(apiSecret);
};

export const getCloudinarySetupMessage = () =>
  'Cloudinary is not configured. Add valid CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET values in backend/.env.';
