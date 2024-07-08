const express = require('express');
const orgController = require('../controllers/orgController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', orgController.getAllOrgs);
router.get('/:orgId', orgController.getOrgById);
router.post('/', orgController.createOrg);
router.post('/:orgId/users', orgController.addUserToOrg);

module.exports = router;
