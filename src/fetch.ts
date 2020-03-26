import { configure, IPaginatedResponse } from '@contentchef/contentchef-node';

export const fetchData = async ({apiKey, spaceId, host, channel, query, targetDate, reporter}): Promise<IPaginatedResponse<object>> => {

    const { id, ...searchConfig } = query;

    const client = configure({
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