import { Button, Checkbox, FormControlLabel, MenuItem, Radio, Select, TextField } from "@mui/material";
import { Field, FieldArray, FieldAttributes, Form, Formik, useField } from "formik";
import * as yup from "yup";

// Usually for form labels in Material, we use something called as a
// Form control label, however, it needs it's own `control` prop and 
// some other stuff that interferes with Formik onChange etc.
// So whenever we need a field that's a bit difficult to create using Formik,
// we can create a custom field like this.
type MyRadioProps = { label: string } & FieldAttributes<{}>;

const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
  const [field] = useField<{}>(props);
  return (
    <FormControlLabel {...field} control={<Radio />} label={label} />
  )
}

// Validation schema using yup
const validationSchema = yup.object({
  firstName: yup.string().required("First Name Field is Required").max(10, "Must be 10 characters or less"),
  pets: yup.array().of(yup.object({
    name: yup.string().required("Pet Name Field is Required"),
  }))
})

// Validation
const MyTextField: React.FC<FieldAttributes<{}>> = ({ placeholder, ...props }) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField {...field} helperText={errorText} placeholder={placeholder} error={!!errorText} />
  )
}

function App() {
  return (
    <div>
      <Formik
        // Used to pass initial values to your form fields as well as keep a track of what fields are there
        initialValues={{
          firstName: "bob",
          lastName: "",
          isTall: false,
          cookies: [],
          yogurt: "",
          pets: [{
            id: "" + Math.random(),
            type: 'cat',
            name: 'jarvis',
          }]
        }}

        // Used to validate your form fields using Formik
        // validate={(values) => {
        //   const errors: Record<string, string> = {};
        //   if (values?.firstName?.includes("bob")) {
        //     errors.firstName = "No bob's allowed";
        //   }
        //   return errors;
        // }}

        // Used to validate your form fields using yup
        validationSchema={validationSchema}

        // Used to handle the form submission
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          // Make Async call to server
          console.log(data);
          setSubmitting(false);
        }}
      >
        {/* Formik gives access to properties that we can get from the function's parameter  */}
        {({ values, errors, isSubmitting }) => (
          // <form onSubmit={handleSubmit}>
          <Form>
            {/* Take all the values from the Formik Component */}
            {/* Passing all Formik parameters to all fields is tedious */}
            {/* <TextField onChange={handleChange} onBlur={handleBlur} value={values.firstName} name="firstName" /> */}
            <div>
              <MyTextField placeholder="First Name" name="firstName" type="input" />
            </div>
            <div>
              <MyTextField placeholder="Last Name" name="lastName" type="input" />
            </div>
            <div>
              <Field name='isTall' type="checkbox" as={Checkbox} />
            </div>
            <div>
              <p> Cookies</p>
              <Field name="cookies" type="checkbox" as={Checkbox} value='chocolate chip' />
              <Field name="cookies" type="checkbox" as={Checkbox} value='snickerdoodle' />
              <Field name="cookies" type="checkbox" as={Checkbox} value='sugar' />
            </div>
            <div>
              <p>Yogurt</p>
              <MyRadio name="yogurt" type="radio" value='mango' label='mango' />
              <MyRadio name="yogurt" type="radio" value='peach' label='peach' />
              <MyRadio name="yogurt" type="radio" value='blueberry' label='blueberry' />
            </div>
            {/* Having multiple fields as an array */}
            <div>
              <FieldArray name="pets">
                {(arrayHelpers) => (
                  <div>
                    <Button onClick={() => arrayHelpers.push({
                      id: "" + Math.random(),
                      type: 'frog',
                      name: '',
                    })}>Add Pet</Button>
                    {values.pets.map((pet, index) => {
                      return (
                        <div key={pet.id}>
                          <MyTextField placeholder="pet name" name={`pets[${index}].name`} />
                          <Field type='select' as={Select} name={`pets[${index}].type`}>
                            <MenuItem value='cat'>cat</MenuItem>
                            <MenuItem value='dog'>dog</MenuItem>
                            <MenuItem value='frog'>frog</MenuItem>
                          </Field>
                          <Button onClick={() => arrayHelpers.remove(index)}>X</Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </FieldArray>
            </div>
            <div><Button type="submit" disabled={isSubmitting}>Submit</Button></div>
            <pre>
              Form output: {JSON.stringify(values, null, 2)}
            </pre>
            <pre>
              Form error: {JSON.stringify(errors, null, 2)}
            </pre>
          </Form>
        )}
      </Formik>

    </div >
  );
}

export default App;
