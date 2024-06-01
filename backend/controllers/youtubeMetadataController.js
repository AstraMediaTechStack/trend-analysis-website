const uploadMetadata = (req, res) => {
    // Handle metadata file upload
    res.send('Metadata uploaded');
  };
  
  const updateMetadata = (req, res) => {
    // Handle metadata update
    res.send('Metadata updated');
  };
  
  module.exports = { uploadMetadata, updateMetadata };
  