# Identicons

HTTP server that generates and serves identicons.

You can access it freely at [https://identicons.pgmichael.com](https://identicons.pgmichael.com) or host it yourself.

## Parameters

The service recognizes the following query parameters:

| Parameter | Type   | Default | Description                                                  |
|-----------|--------|---------|--------------------------------------------------------------|
| `seed`    | string | Random  | A unique value that influences the identicon's design. If not provided, a random design is generated. |
| `size`    | int    | `200`     | Specifies the dimension of the generated identicon in pixels. Absence of this parameter will default the size to 200x200. |
| `theme`   | string | `light` | Specifies the color theme of the generated identicon. The value can be either `light` or `dark`. |

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
