# Loopback model validator

This package allows you to add validation to model definition. Addressing the absence of this implementation as seen in the [Validations](https://loopback.io/doc/en/lb3/Model-definition-JSON-file.html#validations) session of [Model definition JSON file](https://loopback.io/doc/en/lb3/Model-definition-JSON-file.html).

To avoid conflict with future implementations by the Loopback team, I proposed a new and simple structure in defining model properties.

This package also defines the possibility of using data filters that enable cleaner data.

# Validators

In defining the model, use:
```
"properties": {
  "initials": {
    "type": "string",
    "validators": {
      "length": 3
    }
  }
}
```

## Validations supported

| Name                | Value   | Description                                                | Example                    |
| ------------------- | ------- | ---------------------------------------------------------- | -------------------------- |
| **length** / **is** | number  | Length fixed of the string ([Validatable.validatesLengthOf](https://apidocs.loopback.io/loopback-datasource-juggler/#validatable-validateslengthof)) | {"length": 3} or {"is": 3} |
| **min**             | number  | Length min of the string ([Validatable.validatesLengthOf](https://apidocs.loopback.io/loopback-datasource-juggler/#validatable-validateslengthof))   | {"min": 3}                 |
| **max**             | number  | Length max of the string ([Validatable.validatesLengthOf](https://apidocs.loopback.io/loopback-datasource-juggler/#validatable-validateslengthof))   | {"max": 3}                 |
| **pattern**         | object  | Format of the string ([Validatable.validatesFormatOf](https://apidocs.loopback.io/loopback-datasource-juggler/#validatable-validatesformatof))       | {"pattern": {"exp": "/\w+/", "flags": "i"}} |
| **email**           | boolean | Valid email                                                | {"email": true}            |
| **urlIp**           | boolean | Valid URL or IP                                            | {"urlIp": true}            |
| **cpf**             | boolean | Valid CPF (Brazilian document for people)                  | {"cpf": true}              |
| **cnpj**            | boolean | Valid CNPJ (Brazilian document for companies)              | {"cnpj": true}             |
| **unique**          | boolean | Unique value ([Validatable.validatesUniquenessOf](https://apidocs.loopback.io/loopback-datasource-juggler/#validatable-validatesuniquenessof))           | {"unique": true}           |

## Loopback validations

You can use [loopback-datasource-juggler](https://loopback.io/doc/en/lb3/Validating-model-data.html#using-validation-methods) native validation methods, where the propertyName parameter will be the property and the options object the value. Example:

```
// Validatable.validatesLengthOf
"properties": {
  "initials": {
    "type": "string",
    "validators": {
      "lengthOf": {
        "is": 3,
        "allowBlank": true,
        "allowNull": true,
        "message": "length is wrong"
      }
    }
  }
}
```


# Filters

In defining the model, use:
```
"properties": {
  "initials": {
    "type": "string",
    "filters": {
      "upper": true
    }
  }
}
```

## Filters supported

| Name        | Value   | Description                                                                                           | Example       |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| **upper**   | boolean | Converts string, as a whole, to upper case just like [String#toUpperCase](https://mdn.io/toUpperCase) | {"upper": true}                                                            |
| **lower**   | boolean | Converts string, as a whole, to lower case just like [String#toLowerCase](https://mdn.io/toLowerCase) | {"lower": true}                                                            |
| **trim**    | boolean | Removes leading and trailing whitespace or specified characters from string.                      | {"trim": true}                                                             |
| **replace** | object  | Replaces matches for *exp* in string with *replacement*.                                               | {"replace": {"pattern": {"type": "regex", "exp": "[^\\d]", "flags": "g"}} |
