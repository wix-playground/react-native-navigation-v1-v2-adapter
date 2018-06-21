import React from 'react';

export function printFuncExecution(funcName, args) {
  console.log(`Navigation.${funcName}(${argsToString(args)});`);
}

function argsToString(args) {
  let argsArray = [];
  Object.values(args).forEach(arg => {
    argsArray.push(JSON.stringify(arg, null, '\t'));
  });

  return argsArray.join(', ');
}

export function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}

export function logExecution(object) {
  const navigationMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(object));
  navigationMethods.forEach((methodName) => {
    if (object[`_${methodName}`]) {
      return;
    }
    const oldPrototype = object[methodName];

    object[methodName] = function () {
      printFuncExecution(methodName, arguments);
      return oldPrototype.apply(this, arguments);
    };
  });
}

export function wrapReduxComponent(generator, store, Provider) {
  const InternalComponent = generator();
  return class extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <InternalComponent {...this.props} store={store} />
        </Provider>
      );
    }
  };
}
