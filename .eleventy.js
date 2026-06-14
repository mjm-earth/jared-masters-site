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

  // Parse a YouTube/Vimeo URL into { provider, id, poster, play } for click-to-play facades.
  function parseVideo(url) {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]+)/);
    if (yt) {
      const id = yt[1];
      return {
        provider: "youtube",
        id,
        poster: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        play: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      };
    }
    const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) {
      const id = vm[1];
      return {
        provider: "vimeo",
        id,
        poster: `https://vumbnail.com/${id}.jpg`,
        play: `https://player.vimeo.com/video/${id}?autoplay=1&playsinline=1`,
      };
    }
    return null;
  }
  eleventyConfig.addFilter("videoMeta", parseVideo);

  // Chromeless, silent, looping background-video URL for the hero.
  eleventyConfig.addFilter("bgVideo", (url) => {
    const v = parseVideo(url);
    if (!v) return "";
    if (v.provider === "vimeo") {
      return `https://player.vimeo.com/video/${v.id}?background=1&autoplay=1&muted=1&loop=1`;
    }
    return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0`;
  });

  // Initials from a name, for avatar fallbacks ("Nick Hexum" -> "NH").
  eleventyConfig.addFilter("initials", (name) => {
    if (!name) return "";
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
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
