const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();

const { newEvent, getEvents, getSingleEvent, updateEvent, getAdminEvents, deleteEvent, eventSales } = require('../controllers/eventController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/admin/event/new', upload.array('images', 10), isAuthenticatedUser, newEvent);
router.get('/admin/events', isAuthenticatedUser, authorizeRoles('admin'), getAdminEvents);
router.route('/admin/event/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateEvent).delete(deleteEvent);

// Other routes
router.get('/events', getEvents);
router.get('/event/:id', getSingleEvent);
router.get('/admin/event-sales', eventSales);

module.exports = router;
