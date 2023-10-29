const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { currentDT } = require('../../helper/common');

const con = require('../../config/db');
const db = con.getConnection();

// @route   POST /step
// @des     Add a new step
// @access  Public
router.post(
  '/',
  [check('step', 'Step name is required').not().isEmpty()],
  async (req, res) => {
    // Check for form errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if Step name is unique
    try {
      const stepRes = await getStepByName(req.body.step);
      if (stepRes.length) {
        return res.send({
          code: 400,
          success: false,
          message: 'Step already exists',
        });
      }
    } catch (err) {
      return res.send({
        code: 500,
        success: false,
        message: 'Server Error! Try again later',
      });
    }

    // Prepare data
    const dt = currentDT();
    var data = {
      step: req.body.step,
      created: dt,
      updated: dt,
    };

    // Add step
    try {
      const result = await addStep(data);
      console.log('The solution is: ', result);

      // api response
      const response = await getSteps();
      apiRes = {
        result: response,
        code: 201,
        success: true,
        message: 'Step added successfully',
      };
      return res.json(apiRes);
    } catch (err) {
      return res.send({
        code: 500,
        success: false,
        message: 'Server Error! Try again later',
      });
    }
  }
);

// @route   Delete step/:id
// @des     Delete a step
// @access  Public
router.delete('/:id', async (req, res) => {
  const dt = currentDT();

  // Check if Step ID is valid
  try {
    const stepRes = await getStepById(req.params.id);
    if (!stepRes.length) {
      return res.send({
        code: 400,
        success: false,
        message: 'Invalid StepId',
      });
    }
  } catch (err) {
    return res.send({
      code: 500,
      success: false,
      message: 'Server Error! Try again later',
    });
  }

  // Prepare data
  var data = {
    deleted: dt,
  };

  // Mark as delete - Not deleting from the database
  try {
    const result = await deleteStep(data, req.params.id);

    // api response
    const response = await getSteps();
    apiRes = {
      result: response,
      code: 201,
      success: true,
      message: 'Step deleted successfully',
    };
    return res.json(apiRes);
  } catch (err) {
    return res.json({
      code: 500,
      success: false,
      message: 'Server Error! Try again later',
    });
  }
});

module.exports = router;
