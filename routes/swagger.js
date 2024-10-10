const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', (req, res) => {
  /*
    #swagger.description = "This is the Swagger API Documentation UI Page"    
    #swagger.summary = "Swagger API Documentation UI Page with added schema to meet mastery API DOCUMENTATION requirements"
    #swagger.responses[200] = { 
        description: "OK", 
        '@schema': { 
            "type": "object",
            "properties": {
              "successNotification": {
                "type": "string",
                "example": "You have successfully loaded the Swagger API Documentation UI Page!"
                } 
              } 
            } 
          } 
        }    
   */
  res.json('You have successfully loaded the Swagger API Documentation UI Page!');
  swaggerUi.setup(swaggerDocument);
});

module.exports = router;
