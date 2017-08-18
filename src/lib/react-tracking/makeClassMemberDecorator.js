/**
 * Helper to decorate class member
 * Supports class plain methods, field syntax and lazy methods
 * @param {Function} decorate Actual decorator function.
 * Example:
 *   decoratedFn => function () {
 *     // do stuff...
 *     return Reflect.apply(decoratedFn, this, arguments);
 *   }
 * @returns {Function} Class member decorator ((target, name, descriptor) => newDescriptor)
 */
export default function makeClassMemberDecorator(decorate) {
  return function decorateClassMember(target, name, descriptor) {
    const { configurable, enumerable, value, get, initializer } = descriptor;

    if (value) {
      return {
        configurable,
        enumerable,
        value: decorate(value),
      };
    }

    // support lazy initializer
    if (get || initializer) {
      return {
        configurable,
        enumerable,
        get() {
          // This happens if someone accesses the
          // property directly on the prototype
          if (this === target) {
            return null;
          }

          const resolvedValue = initializer
                        ? Reflect.apply(initializer, this, [])
                        : Reflect.apply(get, this, []);
          const decoratedValue = decorate(resolvedValue).bind(this);

          Reflect.defineProperty(this, name, {
            configurable,
            enumerable,
            value: decoratedValue,
          });

          return decoratedValue;
        },
      };
    }

    throw new Error('called makeClassMemberDecorator on unsupported descriptor');
  };
}
