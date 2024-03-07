const config = require("vitest/config");

export default config.defineConfig({
  test: {
    include: ["src/**/*.test.ts", "!src/tests"],
  },
});
