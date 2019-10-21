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

| Name                  | Type          | Description   | Example       |
| --------------------- | ------------- | ------------- | ------------- |
| **length** and **is** | string        |               |               |
| **min**               | string        |               |               |
| **max**               | string        |               |               |
| **pattern**           | string        |               |               |
| **email**             | string        |               |               |
| **urlIp**             | string        |               |               |
| **cpf**               | string        |               |               |
| **cnpj**              | string        |               |               |
| **unique**            | string        |               |               |

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

| Name        | Type          | Description   | Example       |
| ----------- | ------------- | ------------- | ------------- |
| **upper**   | string        |               |               |
| **lower**   | string        |               |               |
| **trim**    | string        |               |               |
| **replace** | string        |               |               |
