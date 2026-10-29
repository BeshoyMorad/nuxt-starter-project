---
paths:
  - "**/schemas/**/*.ts"
  - "**/*.vue"
  - "src/components/form/**"
  - "src/lib/yup/**"
---

# Forms and validation

- This starter uses **vee-validate with yup**, not zod. Wire forms with `useForm({ validationSchema: toTypedSchema(schema) })`, where `useForm` comes from `vee-validate` and `toTypedSchema` from `@vee-validate/yup`.
- Schemas live in `modules/<feature>/schemas/<name>.schema.ts`. Export `schema` and a form type derived from it:

  ```ts
  export const schema = yup.object({ ... });
  export type LoginForm = Partial<yup.InferType<typeof schema>>;
  ```

  Reuse the inferred type. Do not hand-write a second copy of the shape.
- Reusable rules come from `@/lib/yup`: `phoneSchema`, `passwordSchema`, `positiveNumberSchema`, `percentageSchema`, `requiredMediaSchema`, `optionalMediaSchema`. Messages come from the `yup` locale namespace. Add new messages to `src/locales/{en,ar}/yup.json`.
- Yup messages are connected to i18n by `src/plugins/yup.client.ts`, which runs only in the browser. Validation messages therefore resolve on the client. Do not call `setupYupLocale()` anywhere else.
- Do not hardcode error strings on `.required()`, `.email()`, or `.min()`. Omit them so Yup uses `yup.json`, and set `.label()` so `{path}` reads as a field name.
- Field components come from `@/components/form` (for example `Field.Text`, `Field.Password`, `Field.Select`). Match the wiring of the nearby form in the same module.
- Server errors go to fields with `applyApiErrorToForm(error, ctx.setErrors, '<field>')` from `@/utils/apiError`.
- Uploads use `useFormMedia` and `useUploadImage` from `@/composables`. Pass `MediaValue` through `extractMediaPayload`.
- Multi-step forms use `useMultiStepForm` with `MultiStepForm` and `StepIndicator` from `@/components/form`.
