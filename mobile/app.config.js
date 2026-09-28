// يسمح بنشر نسخة الويب تحت مسار فرعي (مثل GitHub Pages: /nabd-oms)
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}),
  },
});
