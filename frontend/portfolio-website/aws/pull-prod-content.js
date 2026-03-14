const { S3Client, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { NODE_ENV } = process.env;

NODE_ENV === 'development' && dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
const REGION = process.env.S3_BUCKET_REGION;
const BUCKET_NAME = process.env.S3_CONTENT_PRODUCTION_BUCKET;
const LOCAL_DIRECTORY_PATH = path.resolve(__dirname, '..', 'content', 'prod');
const CACHE_FILE_PATH = path.join(LOCAL_DIRECTORY_PATH, '.s3-object-cache-ttl.json');
const TTL_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

if(!REGION || !BUCKET_NAME) {
    console.error('Missing env variables');
    console.log({
        REGION,
        BUCKET_NAME,
    });
    process.exit(1);
}

// Create an S3 client
const s3 = new S3Client({ region: REGION });

async function main() {
    try {
        // Load cache
        let cache;
        try {
            cache = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, 'utf-8'));
        } catch {
            cache = {};
        }

        // List all objects in the bucket
        const { Contents: objects } = await s3.send(new ListObjectsCommand({ Bucket: BUCKET_NAME }));
        // console.log({ objects });
        // Download each object to local directory
        for (const object of objects) {
            const { Key } = object;
            const localFilePath = path.join(LOCAL_DIRECTORY_PATH, Key);

            // Check cache for TTL
            const now = Date.now();
            if (cache[Key] && now - cache[Key] < TTL_DURATION) {
                console.log(`'${Key}' is cached and has not expired, skipping download...`);
                continue;
            }

            // Ensure the directory structure exists
            fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

            // Stream the S3 object to a file
            const writeStream = fs.createWriteStream(localFilePath);
            console.log(`Downloading '${Key}' to '${localFilePath}'...`);
            const { Body: downloadStream } = await s3.send(
                new GetObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key,
                })
            );

            downloadStream.pipe(writeStream);

            // Update cache
            cache[Key] = now;
            console.log(`Downloaded '${Key}' to '${localFilePath}'`);
        }

        // Write cache to disk
        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

main();
