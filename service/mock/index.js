function chartData(method) {
  let res = null;
  switch (method) {
    case "GET":
      res = [200, 999, 44, 12, 34, 200];
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = { chartData };
