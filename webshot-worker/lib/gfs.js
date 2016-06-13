var gcloud = require('gcloud');
var url = require('url');
var projectId = process.env.GCLOUD_PROJECT;
var keyFilePath = process.env.GCLOUD_KEYFILE;
var gopts = {};
if (projectId) {
  gopts.projectId = projectId;
  gopts.keyFilename = keyFilePath;
}

console.log(gopts);

var bucketName = 'waybackmachine';

var gcs = gcloud.storage(gopts);
var bucket = gcs.bucket(bucketName);

if (!bucket) {
  gcs.createBucket(bucketName, function(err, b) {
    if (err) {
      console.log('Error creating gcloud bucket', err);
      process.exit();
    }
    console.log('gcloud bucket created');
    bucket = b;
    bucket.acl.default.add({
      entity: 'allUsers',
      role: gcloud.storage.acl.READER_ROLE
    });
  });
}

bucket.acl.default.add({
  entity: 'allUsers',
  role: gcs.acl.READER_ROLE
}, function(err) {
  if (err) {
    return console.log('error setting bucket permissions');
  }
  console.log('bucket set to READER_ROLE for allUsers');
});

var api = module.exports = {};

api.upload = function uploadStream(filename, readStream, callback) {
  var file = bucket.file(filename);
  var writeStream = file.createWriteStream({
    metadata: {
      contentType: 'image/png'
    }
  });
  readStream.pipe(writeStream)
    .on('finish', function() {
      console.log('gcloud upload finished');
      return callback(null, {
        filename: filename,
        originalImage: ['https://storage.googleapis.com', bucketName, filename].join('/')
      });
    })
    .on('error', function(err) {
      console.log('err uploading');
      return callback(err);
    })
}
//
// // Reference an existing bucket.
// var bucket = gcs.bucket('my-existing-bucket');
//
// var localReadStream = fs.createReadStream('/photos/zoo/zebra.jpg');
// var remoteWriteStream = bucket.file('zebra.jpg').createWriteStream();
// localReadStream.pipe(remoteWriteStream);
