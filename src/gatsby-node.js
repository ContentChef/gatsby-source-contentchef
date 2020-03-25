const fetchData = require('./fetch').fetchData;
const createNodeHelpers = require('gatsby-node-helpers').default;

const { createNodeFactory } = createNodeHelpers({
    typePrefix: 'ContentChef',
});

exports.sourceNodes = async ({ store, actions, cache, reporter, getNode, getNodes }, pluginOptions) => {
    const { createNode, deleteNode, touchNode } = actions;
    const { apiKey, spaceId, host, channel, queries, targetDate } = pluginOptions;

    const activity = reporter.activityTimer('Fetched ContentChef Contents');
    activity.start();

    const promises = queries.map(query => fetchData({apiKey, spaceId, host, channel, query, targetDate, reporter}));

    const contents = await Promise.all(promises);

    let newNodes = []

    const existingNodes = getNodes().filter(
        n => n.internal.owner === `gatsby-source-contentchef`
    )

    existingNodes.forEach(n => {
        touchNode({ nodeId: n.id })
    });

    contents.forEach(queryContents => {
        queryContents.items.forEach(content => {
            const node = createNodeFactory(content.definition, node => { node.id = `${content.definition}_${node.metadata.id}`; return node; })(content);
            newNodes.push(node);
            createNode(node);
        }); 
    });

    const diff = existingNodes.filter(
        ({ id: id1 }) => !newNodes.some(({ id: id2 }) => id2 === id1)
    )

    // Delete diff nodes
    diff.forEach(data => {
        deleteNode({ node: getNode(data.id) })
    })

    activity.end();

    return;
}