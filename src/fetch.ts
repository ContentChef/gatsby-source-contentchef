import { configure, IResponse } from '@contentchef/contentchef-node';

export const fetchData = async ({apiKey, spaceId, host, channel, query, targetDate, reporter}): Promise<IResponse<unknown>[]> => {

    const { id, ...searchConfig } = query;

    const client = configure({
        spaceId, host
    }, targetDate);

    const onlineChannel = client.onlineChannel(apiKey, channel);

    reporter.info(`Fetching contents from ContentChef for query ${id}`);

    const search = async (skip = 0) => {
        try {
            const contents = await onlineChannel.search({
                skip,
                take: 100,
                ...searchConfig
            });
            return contents.data.items;
        } catch (error) {
            throw error;
        }
    }

    const searchAllContents = async (skip: number = 0) => {
        try {
            const contents = await search(skip);
            if(contents.length > 0) {
                return contents.concat(await searchAllContents(skip + 100));
            }
            return contents;
        } catch (error) {
            throw error;
        }
    }

    try {
        const contents = await searchAllContents();
        reporter.info(`Successfully retrieved contents from ContentChef for query ${id}`);
        return contents;
    } catch (error) {
        throw error;
    }


}