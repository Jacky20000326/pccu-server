const joi = require("joi")

const memberSchemaJoi = (data) => {
    const schema = joi.object({
        mail: joi.string().email({
            minDomainSegments: 2
        }).required(),
        name: joi.string().required(),
        password: joi.string().min(6).max(30).required(),
    })

    return schema.validate(data)
}

module.exports = memberSchemaJoi
