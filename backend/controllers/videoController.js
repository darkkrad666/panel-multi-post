
const upload = (req, res) => {
  try {
    const { title, description, platforms } = req.body;
    const videoFile = req.file;
    if (!videoFile) return res.status(400).json({ message: 'No video file uploaded' });

    console.log(`---
Video Received: ${videoFile.originalname}
Title: ${title}
Platforms: ${platforms}
---`);

    const selectedPlatforms = JSON.parse(platforms);
    selectedPlatforms.forEach(platform => {
      console.log(`[SIMULATING] Uploading '${videoFile.originalname}' to ${platform}...`);
      setTimeout(() => console.log(`[SIMULATION SUCCESS] Successfully uploaded to ${platform}`), 2000);
    });

    res.status(200).json({ message: 'Video received. Upload process started.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { upload };
