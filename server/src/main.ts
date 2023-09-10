import startServer from "./server";
import input from "./utils/input";

let port = 8080;

input("Enter port: ")
  .then(res => {
    port = parseInt(res);
  })
  .then(() => {
    startServer(port);
  })