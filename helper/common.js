function currentDT() {
  let curr_dt = new Date();
  let form_dt =
    curr_dt.getFullYear() +
    '-' +
    (curr_dt.getMonth() + 1) +
    '-' +
    curr_dt.getDate() +
    ' ' +
    curr_dt.getHours() +
    ':' +
    curr_dt.getMinutes() +
    ':' +
    curr_dt.getSeconds();
  return form_dt;
}

function formatDT(dt) {
  let curr_dt = new Date(dt);
  let form_dt =
    curr_dt.getFullYear() +
    '-' +
    (curr_dt.getMonth() + 1) +
    '-' +
    curr_dt.getDate() +
    ' ' +
    curr_dt.getHours() +
    ':' +
    curr_dt.getMinutes() +
    ':' +
    curr_dt.getSeconds();
  return form_dt;
}

module.exports = {
  formatDT,
  currentDT,
};
