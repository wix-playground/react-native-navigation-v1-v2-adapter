import React from 'react';

export function printFuncExecution(funcName, ...args) {
  console.log(`Navigation.${funcName}(${JSON.stringify(...args, null, '\t')});`);
}

export function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}

export function logNavigationExecution(Navigation) {
  const navigationMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(Navigation));
  navigationMethods.forEach((methodName) => {
    if (Navigation[`_${methodName}`]) {
      return;
    }
    const oldPrototype = Navigation[methodName];

    Navigation[methodName] = function () {
      printFuncExecution(methodName, Array.from(arguments));
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