
export function printFuncExecution(funcName, ...args) {
  console.log(`Navigation.${funcName}(${JSON.stringify(...args, null, "\t")});`);
}