const ContentChef = require('@contentchef/contentchef-node');

exports.fetchData = async ({apiKey, spaceId, host, channel, query, targetDate, reporter}) => {

    const { id, ...searchConfig } = query;

    reporter.info(`Initializing ContentChef client for query ${id}: \napiKey: ${apiKey} \nspaceId: ${spaceId} \nhost: ${host} \ndate: ${targetDate} \nchannel: ${channel}`);

    client = ContentChef.configure({
        apiKey, spaceId, host
    }, targetDate);

    const onlineChannel = client.onlineChannel(channel);

    reporter.info(`Fetching contents from ContentChef for query ${id}`);

    try {
        const contents = await onlineChannel.search({
            skip: 0,
            take: 100,
            ...searchConfig
        });
        reporter.info(`Successfully retrieved contents from ContentChef for query ${id}`);
    
        return contents.data;
    } catch (error) {
        throw error;
    }


}