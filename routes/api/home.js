const express = require('express');
const router = express.Router();
require('../../model/common');

// @route   GET api/home
// @des     Test Route
// @access  Public
router.get('/', async (req, res) => {
  const response = await getSteps();

  apiRes = {
    result: response,
    code: 200,
    success: 'true',
  };
  return res.json(apiRes);
});

module.exports = router;
