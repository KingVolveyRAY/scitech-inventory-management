import * as sdk from "node-appwrite";

console.log("SDK Exports:", Object.keys(sdk));
if (sdk.InputFile) {
  console.log("InputFile methods:", Object.getOwnPropertyNames(sdk.InputFile));
  // Check if it's a class or object
  console.log("InputFile type:", typeof sdk.InputFile);
} else {
  console.log("InputFile is UNDEFINED in node-appwrite");
}
