const express = require('express');
const upload = require('../utils/multer')
const router = express.Router();

const {newEvent, getEvents, getSingleEvent, updateEvent, getAdminEvents, deleteEvent} = require('../controllers/eventController');

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')


router.post('/event/new', upload.array('images', 10), isAuthenticatedUser, newEvent)
router.get('/events',  getEvents)
router.get('/event/:id', getSingleEvent);

router.get('/admin/events', isAuthenticatedUser, authorizeRoles('admin'), getAdminEvents)
router.route('/admin/event/:id', isAuthenticatedUser, authorizeRoles('admin',)).put(updateEvent).delete(deleteEvent);

module.exports = router;