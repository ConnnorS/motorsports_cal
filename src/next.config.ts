import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@import "~open-color/open-color";`,
  },
};

export default nextConfig;
