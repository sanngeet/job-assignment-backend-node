const express = require('express');
const router = express.Router();
const con = require('../../config/db');
const db = con.getConnection();
const { check, validationResult } = require('express-validator');
const { currentDT } = require('../../helper/common');

// @route   POST item
// @des     Add an item
// @access  Public
router.post(
  '/',
  [
    check('id', 'Id is required').not().isEmpty(),
    check('item', 'Item is required').not().isEmpty(),
    check('title', 'Item is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if Step ID is valid
    try {
      const stepRes = await getStepById(req.body.id);
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

    // Check if Item name is unique
    try {
      const result = await getItemByName(req.body.item);
      if (result.length) {
        return res.send({
          code: 400,
          success: false,
          message: 'Item already exists',
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
      step_id: req.body.id,
      item: req.body.item,
      title: req.body.title,
      description: req.body.description,
      created: dt,
      updated: dt,
    };

    // Add Step
    try {
      const result = await addItem(data);

      // api response
      const response = await getSteps();
      apiRes = {
        result: response,
        code: 201,
        success: true,
        message: 'Item added successfully',
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

// @route   PUT /item/:id
// @des     Update an item
// @access  Public
router.put(
  '/:id',
  [
    check('step_id', 'Step Id is required').not().isEmpty(),
    check('item', 'Item is required').not().isEmpty(),
    check('title', 'Item is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if Step ID is valid
    try {
      const stepRes = await getStepById(req.body.step_id);
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

    // Check if Item ID is valid
    try {
      const response = await getItemById(req.params.id);
      if (!response.length) {
        return res.send({
          code: 400,
          success: false,
          message: 'Invalid itemId',
        });
      }
    } catch (err) {
      return res.send({
        code: 500,
        success: false,
        message: 'Server Error! Try again later',
      });
    }

    // Check if Item name is unique (Ignore item name of current record)
    try {
      const result = await getItemByNameIgnoreSelf(
        req.params.id,
        req.body.item
      );
      if (result.length) {
        return res.send({
          code: 400,
          success: false,
          message: 'Item already exists',
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
      item: req.body.item,
      title: req.body.title,
      description: req.body.description,
      updated: dt,
    };

    // Update Item
    try {
      const result = await updateItem(req.params.id, data);

      // api response
      const response = await getSteps();
      apiRes = {
        result: response,
        code: 200,
        success: true,
        message: 'Item updated successfully',
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

// @route   Delete /item/:id
// @des     Delete an item
// @access  Public
router.delete('/:id', async (req, res) => {
  const dt = currentDT();

  // Check if Item ID is valid
  try {
    const response = await getItemById(req.params.id);
    if (!response.length) {
      return res.send({
        code: 400,
        success: false,
        message: 'Invalid itemId',
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
    const result = await deleteItem(data, req.params.id);

    // api response
    const response = await getSteps();
    apiRes = {
      result: response,
      code: 201,
      success: true,
      message: 'Item deleted successfully',
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
