import { fetchData }  from './fetch';
import createNodeHelpers from 'gatsby-node-helpers';
import { IResponse } from '@contentchef/contentchef-node';

const { createNodeFactory } = createNodeHelpers({
    typePrefix: 'ContentChef',
});

export const sourceNodes = async ({ actions, reporter, getNode, getNodes }, pluginOptions) => {
    const { createNode, deleteNode, touchNode } = actions;
    const { apiKey, spaceId, host, channel, queries, targetDate } = pluginOptions;

    const activity = reporter.activityTimer('Fetch contents from ContentChef');
    activity.start();

    const promises: Promise<IResponse<unknown>[]>[] = queries.map(query => fetchData({apiKey, spaceId, host, channel, query, targetDate, reporter}));

    const contents = await Promise.all(promises);

    let newNodes: any[] = []

    const existingNodes = getNodes().filter(
        n => n.internal.owner === `gatsby-source-contentchef`
    )

    existingNodes.forEach(n => {
        touchNode({ nodeId: n.id })
    });

    contents.forEach(queryContents => {
        queryContents.forEach(content => {
            const node = createNodeFactory(content.definition, node => { node.id = `${node.definition}_${node.metadata.id}`; return node; })(content);
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