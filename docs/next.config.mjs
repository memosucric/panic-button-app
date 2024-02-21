import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

const isStandalone = !!process.env.STANDALONE_DOCS

const deployPath = isStandalone ? '' : '/docs'

export default withNextra({
  basePath: deployPath,
  assetPrefix: deployPath,
  reactStrictMode: false,
  output: 'standalone',
  productionBrowserSourceMaps: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil'
    })
    return config
  }
})
