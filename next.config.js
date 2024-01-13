const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
        mdxRs: true,
    },

});