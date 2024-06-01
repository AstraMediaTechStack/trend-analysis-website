const analyzeKeywords = (req, res) => {
    // Handle keyword analysis
    res.send('Keywords analyzed');
  };
  
  const uploadKeywords = (req, res) => {
    // Handle keyword file upload
    res.send('Keywords uploaded');
  };
  
  module.exports = { uploadKeywords, analyzeKeywords };
  