module.exports = {
  siteUrl: 'https://www.jobscriptor.com',
  generateRobotsTxt: true,

  additionalPaths: async () => {
    return [
      { loc: '/resume-generator', lastmod: new Date().toISOString() },
      { loc: '/cover-letter', lastmod: new Date().toISOString() },
      { loc: '/jobs', lastmod: new Date().toISOString() },
      { loc: '/profile', lastmod: new Date().toISOString() },
    ];
  },
};