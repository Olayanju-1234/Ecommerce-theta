import { celebrate, Joi, SchemaOptions } from "celebrate";
export const Validate = (schema: any) =>
  Joi.object().keys(schema).unknown().required();

export const JoiValidatorOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
  stripUnknown: true,
  abortEarly: false,
};


export function RequestValidator(
  requestRules: SchemaOptions,
  options?: { allowUnknown?: boolean; stripUnknown?: boolean }
) {
  return celebrate(requestRules, { ...JoiValidatorOptions, ...options });
}