module.exports = {
  siteMetadata: {
    title: "RVNUG",
    author: "Roanoke Valley .NET User Group Officers",
    description: ""
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Roanoke Valley .NET User Group',
        short_name: 'RVNUG',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/assets/images/website-icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
    'gatsby-plugin-lodash'
  ],
}
