const fs = require('fs');
const path = require('path');
const noblox = require('noblox.js');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { securityToken, imagePath, decalName } = req.body;

    if (!securityToken || !imagePath || !decalName) {
      res.status(400).send('Missing required fields.');
      return;
    }

    try {
      await noblox.setCookie(securityToken);
      const filePath = path.resolve(__dirname, imagePath);
      const file = fs.createReadStream(filePath);
      const assetType = 13;
      const response = await noblox.uploadItem(decalName, assetType, file);
      res.status(200).json({ message: 'Decal uploaded successfully!', data: response });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload decal.', error: error.message });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
