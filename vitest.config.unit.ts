const config = require("vitest/config");

export default config.defineConfig({
  test: {
    include: ["v1/**/*.test.ts", "!v1/tests"],
  },
});
