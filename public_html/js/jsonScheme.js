(function () {
  function JsonValidator() {
    this.trace = true;
  }

  JsonValidator.prototype.validate = function (json, scheme) {
    var result = true;
    if (scheme.type === 'object') {
      result = this.validateObject(json, scheme);
    } else if (scheme.type === 'array') {
      result = this.validateArray(json, scheme);
    } else if (scheme.type === 'string') {
      result = this.validateString(json, scheme);
    } else {
      result = false;
    }
    return result;
  };

  JsonValidator.prototype.validateObject = function (json, scheme) {
    var result = true;
    var propertiesToValidate = scheme.properties || {};
    var requiredProperties = scheme.required || [];
    if (typeof json === 'object' && !Array.isArray(json)) {
      for (var prop in propertiesToValidate) {
        if (prop in json) {
          if (!this.validate(json[prop], propertiesToValidate[prop])) {
            result = false;
            break;
          }
        } else if (requiredProperties.indexOf(prop) !== -1) {
          console.log('Missing property %s', prop);
          result = false;
          break;
        }
      }
    } else {
      console.log('expected object got %s', Array.isArray(json) ? "array" : typeof (json));
      result = false;
    }
    return result;
  };

  JsonValidator.prototype.validateArray = function (json, scheme) {
    var result = true;
    var elementScheme = scheme.element;
    if (Array.isArray(json)) {
      var len = json.length;
      for (var i = 0; i < len; i++) {
        if (!this.validate(json[i], elementScheme)) {
          result = false;
          break;
        }
      }
    } else {
      console.log('expected array got %s', typeof (json));
      result = false;
    }
    return result;
  };

  JsonValidator.prototype.validateString = function (json, scheme) {
    var result = true;
    if (typeof json !== 'string') {
      console.log('expected string got %s', typeof (json));
      result = false;
    }
    return result;
  };

  var jsonValidator = new JsonValidator();
  var schemes = [
    {
      type: 'object',
      properties: {
        report: {
          type: 'string'
        }
      },
      required: ['report']
    },
    {
      type: 'array',
      element: {
        type: 'string'
      }
    },
    {
      type: 'object',
      properties: {
        properties: {
          type: 'object'
        },
        element: {
          type: 'object'
        },
        required: {
          type: 'array',
          element: {
            type: 'string'
          }
        }
      }
    }
  ];
  var jsons = [
    {
      report: 'HELLO'
    },
    [
      'ababa',
      'bbbbb'
    ],
    {
      type: 'object',
      properties: {
        report: {
          type: 'string'
        }
      },
      required: ['report']
    }
  ];
  for (var i = 0; i < schemes.length; i++) {
    console.groupCollapsed('Test ' + (i + 1));
    console.log(jsonValidator.validate(jsons[i], schemes[i]));
    console.groupEnd('Test ' + (i + 1));
  }
})();
