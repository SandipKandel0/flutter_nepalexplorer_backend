import Guide from '../models/guide.js';
import User from '../models/User.js';
import BookingRequest from '../models/BookingRequest.js';
import Notification from '../models/Notification.js';

// Get all guides (for users to browse)
export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find()
      .populate('userId', 'fullName email phoneNumber')
      .select('-password');

    res.json({ success: true, data: guides });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create booking request
export const createBookingRequest = async (req, res) => {
  try {
    const { guideId, destinationName, startDate, endDate, numberOfPeople, notes } = req.body;

    if (!guideId || !destinationName || !startDate || !endDate || !numberOfPeople) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const request = new BookingRequest({
      guideId,
      userId: req.user.id,
      destinationName,
      startDate,
      endDate,
      numberOfPeople,
      notes: notes || '',
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: 'Request sent successfully',
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get booking requests for a guide
export const getGuideRequests = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.user.id });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    const requests = await BookingRequest.find({ guideId: guide._id })
      .populate('userId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 });

    // Add userName and userEmail to the response
    const requestsWithUserInfo = requests.map(req => {
      const reqObj = req.toObject();
      reqObj.userName = req.userId?.fullName || 'Unknown';
      reqObj.userEmail = req.userId?.email || 'Unknown';
      return reqObj;
    });

    res.json({ success: true, data: requestsWithUserInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update booking request status
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await BookingRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Verify that the current user is the guide for this request
    const guide = await Guide.findById(request.guideId);
    if (!guide || guide.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    request.status = status;
    await request.save();

    // Create notification for the user who made the request
    const guideUser = await User.findById(guide.userId);
    const notification = new Notification({
      userId: request.userId,
      type: status,
      title: status === 'accepted' ? 'Request Accepted!' : 'Request Rejected',
      message: `${guideUser?.fullName || 'A guide'} has ${status} your booking request.`,
      relatedRequestId: request._id,
      guideName: guideUser?.fullName || 'Unknown Guide',
    });

    await notification.save();

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
