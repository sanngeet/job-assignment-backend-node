const express = require('express');
const con = require('../config/db');
const { formatDT } = require('../helper/common');
const db = con.getConnection();
// const { currentDT } = require('../../helper/common');

// Step model
getSteps = () => {
  return new Promise((resolve, reject) => {
    let query =
      "SELECT s.id step_id, s.step step_name, s.created, s.updated, GROUP_CONCAT(i.id ORDER BY i.id SEPARATOR':::') AS item_id, GROUP_CONCAT(i.item ORDER BY i.id SEPARATOR ':::') AS item_name, GROUP_CONCAT(i.title ORDER BY i.id SEPARATOR ':::') AS item_title, GROUP_CONCAT(i.description ORDER BY i.id SEPARATOR ':::') AS item_description, GROUP_CONCAT(i.updated ORDER BY i.id SEPARATOR ':::') AS item_updated, GROUP_CONCAT(i.created ORDER BY i.id SEPARATOR ':::') AS item_created FROM steps s LEFT JOIN items i ON i.step_id=s.id AND i.deleted IS NULL WHERE s.deleted IS NULL GROUP BY s.id";

    db.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }

      // Prepare response
      results.forEach((value, index) => {
        value['created'] = formatDT(value['created']);
        value['updated'] = formatDT(value['updated']);

        if (value['item_id'] != null) {
          value['items'] = [];

          // Item ids
          let itemIds = value['item_id'].split(':::');
          itemIds.forEach((v, i) => {
            value['items'].push({
              item_id: v,
            });
          });

          // Item names
          let itemNames = value['item_name'].split(':::');
          itemNames.forEach((v, i) => {
            value['items'][i]['item_name'] = v;
          });

          // Item title
          let itemTitles = value['item_title'].split(':::');
          itemTitles.forEach((v, i) => {
            value['items'][i]['item_title'] = v;
          });

          // Item description
          let itemDescription = value['item_description'].split(':::');
          itemDescription.forEach((v, i) => {
            value['items'][i]['item_description'] = v;
          });

          // Item updated
          let itemUpdatedDT = value['item_updated'].split(':::');
          itemUpdatedDT.forEach((v, i) => {
            value['items'][i]['item_updated'] = v;
          });

          // Item created
          let itemCreatedDT = value['item_created'].split(':::');
          itemCreatedDT.forEach((v, i) => {
            value['items'][i]['item_created'] = v;
          });
        }

        delete value['item_id'];
        delete value['item_name'];
        delete value['item_description'];
        delete value['item_title'];
        delete value['item_created'];
        delete value['item_updated'];
      });
      return resolve(results);
    });
  });
};

getStepById = (id) => {
  let query = 'SELECT id FROM steps WHERE id=' + id + ' AND deleted IS NULL';
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

getStepByName = (step) => {
  let query = 'SELECT step FROM steps WHERE step=? AND deleted IS NULL';
  return new Promise((resolve, reject) => {
    db.query(query, step, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

addStep = (data) => {
  let query = 'INSERT INTO steps SET ?';
  return new Promise((resolve, reject) => {
    db.query(query, data, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

// Used to mark the record as deleted
deleteStep = (data, id) => {
  let query = 'UPDATE steps SET ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [data, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

// Item model
getItemById = (id) => {
  let query = 'SELECT id FROM items WHERE id=' + id + ' AND deleted IS NULL';
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

getItemByName = (item) => {
  let query = 'SELECT item FROM items WHERE item=? AND deleted IS NULL';
  return new Promise((resolve, reject) => {
    db.query(query, item, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

getItemByNameIgnoreSelf = (id, item) => {
  let query =
    'SELECT item FROM items WHERE id!=? AND item=? AND deleted IS NULL';
  return new Promise((resolve, reject) => {
    db.query(query, [id, item], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

addItem = (data) => {
  let query = 'INSERT INTO items SET ?';
  return new Promise((resolve, reject) => {
    db.query(query, data, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

updateItem = (id, data) => {
  let query = 'UPDATE items SET ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [data, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

// Used to mark the record as deleted
deleteItem = (data, id) => {
  let query = 'UPDATE items SET ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [data, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

module.exports = {
  getSteps,
  getStepById,
  getStepByName,
  addStep,
  deleteStep,
  getItemById,
  getItemByName,
  addItem,
  deleteItem,
  updateItem,
};
