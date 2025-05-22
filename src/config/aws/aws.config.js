const {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand,
    GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const { AWS_FOLDER, AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } = process.env;

const s3Client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
});

const uploadParams = { Bucket: AWS_BUCKET_NAME, Key: '', Body: '', ACL: 'public-read-write', ContentType: '' };
const DOWNLOAD_URL_EXPIRE = 7 * 24 * 60 * 60;
const MAX_FILE_PER_DOMAIN = 5;

module.exports = {
    uploadFileToS3: async ({ domain, file, name, type }) => {
        const pathFolder = `${AWS_FOLDER}/${domain}/themes`;

        // Create a new folder if it doesn't exist yet
        const fileList = await s3Client.send(
            new ListObjectsV2Command({
                Bucket: AWS_BUCKET_NAME,
                Prefix: pathFolder,
                MaxKeys: 10,
            })
        );

        const totalFileInFolder = fileList.Contents?.length || fileList.KeyCount;
        if (!totalFileInFolder || totalFileInFolder < 0) {
            const createFolder = await s3Client.send(
                new PutObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: pathFolder,
                    ACL: 'public-read-write',
                })
            );

            if (!createFolder.ETag?.length) {
                throw 'Folder creation failed';
            }
        }

        // Delete oldest files if over max
        if (fileList.Contents?.length >= MAX_FILE_PER_DOMAIN) {
            const sortedFiles = fileList.Contents.sort((a, b) => a.LastModified - b.LastModified);

            const filesToDelete = sortedFiles.length - MAX_FILE_PER_DOMAIN + 1;

            for (let i = 0; i < filesToDelete; i++) {
                const fileToDelete = sortedFiles[i].Key;

                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: AWS_BUCKET_NAME,
                        Key: fileToDelete,
                    })
                );
            }
        }

        // Good
        uploadParams.Body = file;
        uploadParams.Key = `${pathFolder}/${name}`;
        uploadParams.ContentType = type;

        return await s3Client.send(new PutObjectCommand(uploadParams));
    },
    getUrlToDownload: async ({ domain, name, expire }) => {
        const pathFile = `${AWS_FOLDER}/${domain}/themes/${name}`;

        return await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: AWS_BUCKET_NAME,
                Key: pathFile,
            }),
            {
                expiresIn: expire || DOWNLOAD_URL_EXPIRE,
            }
        );
    },
};
