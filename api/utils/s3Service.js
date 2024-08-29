
import AWS from 'aws-sdk'
import fs from 'fs'
const { STORAGE_ACCESS_SECRET, STORAGE_ACCESS_KEY, STORAGE_REGION, STORAGE_SPACE_NAME, STORAGE_HOST } = process.env;

// Configure AWS SDK with your DigitalOcean Spaces credentials
const region = STORAGE_REGION
const spacesEndpoint = new AWS.Endpoint(region + "." + STORAGE_HOST);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: STORAGE_ACCESS_KEY,
    secretAccessKey: STORAGE_ACCESS_SECRET,
});
console.log('STORAGE_ACCESS_SECRET', STORAGE_ACCESS_SECRET)
console.log('STORAGE_ACCESS_KEY', STORAGE_ACCESS_KEY)
console.log('STORAGE_REGION', STORAGE_REGION)
console.log('STORAGE_SPACE_NAME', STORAGE_SPACE_NAME)
console.log('STORAGE_HOST', STORAGE_HOST)
console.log('s3', s3)
console.log('spacesEndpoint', spacesEndpoint)

const spaceName = STORAGE_SPACE_NAME;

export function uploadFile(filePath) {
    // Read the file as a buffer
    const fileContent = fs.readFileSync(filePath);

    // Set the parameters for S3 upload
    const params = {
        Bucket: spaceName,
        Key: filePath, // This is the name you want to give the object in the Space
        Body: fileContent,
        ACL: 'public-read'
    };

    // Return a promise for better handling in the calling code
    return new Promise((resolve, reject) => {
        // Upload the file to the Space
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const encodedFilePath = filePath;
                const cdnUrl = `https://${spaceName}.${region}.cdn.${STORAGE_HOST}/${encodedFilePath}`;
                const responseData = {
                    ...data,
                    filename: data.Key,
                    cdnUrl,
                };

                // Example response 
                // {
                //     ETag: '"0ece9e7b286ef9e4979400372c9a312c"',
                //     Location: 'https://sample.blr1.digitaloceanspaces.com/1723881366910-7525-logo.jpg',
                //     key: '1723881366910-7525-logo.jpg',
                //     Key: '1723881366910-7525-logo.jpg',
                //     filename: '1723881366910-7525-logo.jpg',
                //     Bucket: 'sample',
                //     cdnUrl: 'https://sample.blr1.cdn.digitaloceanspaces.com/1723881366910-7525-logo.jpg'
                //   }

                resolve(responseData);
            }
        });
    });
}

export function deleteFile(filePath) {
    let path = filePath.split(STORAGE_HOST + '/')[1];
    const params = {
        Bucket: spaceName,
        Key: path,
    };

    // Return a promise for better handling in the calling code
    return new Promise((resolve, reject) => {
        // Delete the file from the Space
        s3.deleteObject(params, (err, data) => {
            console.log(err, data)
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}
