import { enableTailwind } from "@remotion/tailwind-v4";

/**
 *  @param {import('webpack').Configuration} currentConfig
 */
export const webpackOverride = (currentConfig) => {
  const config = enableTailwind(currentConfig);
  const output = config.output ?? {};
  return {
    ...config,
    cache: false,
    output: {
      ...output,
      hashFunction: "sha256",
    },
  };
};
