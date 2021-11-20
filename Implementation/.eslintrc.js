module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "simple-import-sort"
    ],
    "rules": {
        "no-restricted-syntax": [
            "warn",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info)$/]",
                "message": "Do not use console.* for production. Allowed methods are console.info/warn/error."
            }
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "explicit",
                "ignoredMethodNames": ["constructor"]
            }
        ],
        "@typescript-eslint/indent": "error",
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/comma-spacing": ["warn"],
        "@typescript-eslint/typedef": [
            "error",
            {
                "arrowParameter": true,
                "variableDeclaration": true
            }
        ],
        "@typescript-eslint/array-type": ["warn", { "default": "generic" }],
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-misused-new": "warn",
        // "@typescript-eslint/no-magic-numbers": ["warn", {
        //     "ignore": [-1, 0, 1],
        //     "ignoreArrayIndexes": true,
        //     "detectObjects": true,
        //     "ignoreNumericLiteralTypes": true,
        //     "ignoreReadonlyClassProperties": true,
        //     "ignoreEnums": true
        // }],
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars-experimental": "error",
        "@typescript-eslint/no-useless-constructor": "off",
        "@typescript-eslint/member-ordering": ["warn", {
            "default": [
                "private-static-field",
                "private-instance-field",
                "protected-static-field",
                "protected-instance-field",
                "public-static-field",
                "public-instance-field",
                "private-constructor",
                "protected-constructor",
                "public-constructor",
                "private-static-method",
                "private-instance-method",
                "protected-static-method",
                "protected-instance-method",
                "public-static-method",
                "public-instance-method"
            ]
        }],

        "sort-imports": "off",
        "simple-import-sort/imports": "error",
        "@typescript-eslint/no-param-reassign": 0,
        "brace-style": ["warn", "allman"],
        "@typescript-eslint/quotes": [
            "warn",
            "double"
        ],
        "@typescript-eslint/semi": [
            "warn",
            "always"
        ],
        "arrow-body-style": "warn",
        "camelcase": "warn",
        "comma-dangle": "warn",
        "complexity": [
            "warn",
            {
                "max": 20
            }
        ],
        "constructor-super": "warn",
        "curly": "warn",
        "eqeqeq": [
            "off",
            "always"
        ],
        "id-blacklist": [
            "warn",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined",
            "undefined"
        ],
        "id-match": "warn",
        "max-classes-per-file": [
            "warn",
            1
        ],
        "no-cond-assign": "warn",
        "no-duplicate-case": "warn",
        "no-duplicate-imports": "warn",
        "no-empty": "warn",
        "no-invalid-this": "off",
        "no-irregular-whitespace": "warn",
        "no-multiple-empty-lines": "off",
        "no-new-wrappers": "warn",
        "no-redeclare": "warn",
        "no-shadow": [
            "warn",
            {
                "hoist": "all"
            }
        ],
        "no-template-curly-in-string": "warn",
        "no-throw-literal": "warn",
        "no-trailing-spaces": "warn",
        "no-underscore-dangle": "off",
        "no-unused-expressions": "error",
        "no-var": "warn",
        "one-var": [
            "warn",
            "never"
        ],
        "prefer-const": "warn",
        "prefer-template": "warn",
        "quote-props": [
            "warn",
            "consistent"
        ],
        "radix": "warn",
        "space-before-function-paren": 0,
        "space-in-parens": 0,
        "spaced-comment": "warn",
        "use-isnan": "warn"
    }
};
