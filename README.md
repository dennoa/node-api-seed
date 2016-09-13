# node-api-seed
Template for a node API

Swagger, express, mongoose API template. 

Makes use of:
* <https://github.com/dennoa/stateless-auth> for authentication 
* <https://github.com/dennoa/config-obfuscator> for obfuscation
* <https://github.com/ctavan/express-validator> for validating requests
* <https://github.com/dennoa/cruddy-express-api> for simple crud stuff
* <https://github.com/dennoa/promise-to-respond> for responding

## server/index.js
Is the starting point.

## server/register-server-event-listeners.js
Registers a startup listener that takes care of a few initialisation bits.

## server/api
Contains the various api operations. Includes implementations for API Key and User administration.

/swagger provides the API documentation. It merges in the swagger doc fragments from each of the individual operations. Update 

    /swagger/api-docs-to-include.js

to reference the operation documents to be included.

Each operation responsible for a document fragment can provide one of:
* A json representation of the docs
* A function that returns a json representation of the docs
* A function that returns a promise that resolves to a json representation of the docs

The function will be passed (req, res) parameters.

## server/components
Contains the various components that support the api operations. Refer to the API Key and User implementations for various examples of component usage.
 