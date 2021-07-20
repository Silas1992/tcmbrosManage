const cloud = require("@cloudbase/node-sdk");

exports.main = async (event, context) => {
  const app = cloud.init({
    env: cloud.SYMBOL_URRENT_ENV,
  });

  // todo
  // your code here
  return {
    event,
    context
  };
};
