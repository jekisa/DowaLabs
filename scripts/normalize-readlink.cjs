const fs = require("node:fs");

function normalizeReadlinkError(error) {
  if (error?.code === "EISDIR") {
    error.code = "EINVAL";
  }
  return error;
}

const readlink = fs.readlink.bind(fs);
fs.readlink = (path, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  const handleResult = (error, result) => callback(normalizeReadlinkError(error), result);
  return options === undefined
    ? readlink(path, handleResult)
    : readlink(path, options, handleResult);
};

const readlinkSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = (path, options) => {
  try {
    return options === undefined ? readlinkSync(path) : readlinkSync(path, options);
  } catch (error) {
    throw normalizeReadlinkError(error);
  }
};

const promisesReadlink = fs.promises.readlink.bind(fs.promises);
fs.promises.readlink = async (path, options) => {
  try {
    return options === undefined
      ? await promisesReadlink(path)
      : await promisesReadlink(path, options);
  } catch (error) {
    throw normalizeReadlinkError(error);
  }
};
