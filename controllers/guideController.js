// import Guide from '../models/guide.js';
// import User from '../models/User.js';

// // Get Guide Profile
// export const getGuideProfile = async (req, res) => {
//   try {
//     const guide = await Guide.findOne({ userId: req.user.id }).populate('userId', '-password');
//     if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });

//     res.json({ success: true, data: guide });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Update Guide Profile
// export const updateGuideProfile = async (req, res) => {
//   try {
//     const { bio, languages } = req.body;
//     const guide = await Guide.findOne({ userId: req.user.id });
//     if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });

//     guide.bio = bio || guide.bio;
//     guide.languages = languages || guide.languages;
//     await guide.save();

//     res.json({ success: true, data: guide });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
