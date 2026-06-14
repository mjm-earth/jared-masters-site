module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the build output
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" }); // robots.txt, llms.txt, favicon, CNAME

  // Watch CSS so the dev server reloads on style changes
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Small helper: turn a YouTube/Vimeo URL into a privacy-friendly embed URL
  eleventyConfig.addFilter("embedUrl", (url) => {
    if (!url) return "";
    const yt = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]+)/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return url;
  });

  // Current year for the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    // Root deploy ("/") by default. For a GitHub *project* page served at
    // username.github.io/REPO/, set PATH_PREFIX=/REPO/ (the workflow does this).
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
