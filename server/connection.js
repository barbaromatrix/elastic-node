const elasticsearch = require('elasticsearch');

const index = 'library';
const type = 'novel';
const port = 9200;
const host = process.env.PORT || 'localhost';
const client = new elasticsearch.Client({
    host: { host, port }
});

async function checkConnection () {
    let isConnected = false;

    while (!isConnected) {
        console.log('Connecting to ES');
        try {
            const health = await client.cluster.health({});
            console.log(health);
            isConnected = true;
        } catch (err) {
            console.log('Connection Failed, Retrying...', err);
        }
    }
}

async function resetIndex () {
    if (await client.indices.exists({ index })) {
      await client.indices.delete({ index });
    }
  
    await client.indices.create({ index });
    await putBookMapping();
}