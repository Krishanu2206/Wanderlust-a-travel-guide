const Joi = require('joi');

const listingschema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.object({
            url:Joi.string().allow("", null),
        }),
    }).required()
});

const reviewschema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    })
});    //Error is occurring in this case...will rectify later

/* module.exports=listingschema;
module.exports=reviewschema; */  
//The issue in your code is related to how you are exporting the schemas. You are overwriting the module.exports property with the second schema, so only the reviewschema will be exported, and the listingschema will be ignored. To fix this, you can either export both schemas in the same module.exports statement or export them with different names. Here's an example of how you can do it:

module.exports = {
    listingschema,
    reviewschema,
};

//OR 

/* module.exports = {
    listingschema,
};

module.exports = {
    reviewschema,
}; */
