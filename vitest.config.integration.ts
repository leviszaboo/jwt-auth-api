const config = require("vitest/config");

export default config.defineConfig({
  test: {
    include: ["v1/tests/**/*.test.ts"],
    maxConcurrency: 1,
    setupFiles: ["v1/tests/helpers/setup.ts"],
  },
});
