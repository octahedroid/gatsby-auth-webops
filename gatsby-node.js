const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allNodeArticle {
        edges {
          node {
            path{
              alias
            }
          }
        }
      }
      allNodePage {
        edges {
          node {
            path{
              alias
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create landing pages.
    const articles = result.data.allNodeArticle.edges;
    articles.forEach(article => {
      createPage({
        path: article.node.path.alias,
        component: path.resolve(`./src/templates/article.js`),
        context: {
          slug: article.node.path.alias
        }
      });
    });

    // Create pages.
    const pages = result.data.allNodePage.edges
    pages.forEach(page => {
      createPage({
        path: page.node.path.alias,
        component: path.resolve(`./src/templates/page.js`),
        context: {
          slug: page.node.path.alias,
        },
      })
    });
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/protected/)) {
    page.matchPath = `/protected/*`

    // Update the page.
    createPage(page)
  }
}
