import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { FormField } from "../components/formField/FormField";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\S]+$/,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special case character"
    )
    .required("Password is required"),
});
function Login() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const initialValue = useMemo(() => {
    return {
      email: "",
      password: "",
    };
  }, []);

  const onSubmit = (values: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, values)
        .then((res) => {
          setIsSubmitting(false);
          localStorage.setItem("token", res.headers["x-auth-token"]);
          navigate("../");
        })
        .catch((err) => {
          console.log(err);
          setIsSubmitting(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box
        borderWidth={1}
        px={4}
        width="full"
        maxWidth="500px"
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Box p={4}>
          <Box textAlign="center">
            <Text>
              <br></br>
            </Text>
            <Heading>Sign In to Your Account</Heading>
            <Text>
              <br></br>
            </Text>
            {/* <Text color="red">{"errorMsg"}</Text> */}
          </Box>

          <Formik
            initialValues={initialValue}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, errors, touched, submitForm }) => (
              <Form>
                <FormField
                  disabled={false}
                  required={false}
                  name="Email : "
                  fieldName="email"
                  type="email"
                  error={errors.email ? (errors.email as string) : undefined}
                />
                <FormField
                  disabled={false}
                  required={false}
                  name="Password : "
                  fieldName="password"
                  type="password"
                  error={
                    errors.password ? (errors.password as string) : undefined
                  }
                />

                {isSubmitting ? (
                  <Flex
                    bg="white.500"
                    color="gery.500"
                    width="full"
                    justifyContent="center"
                    mt={4}
                  >
                    <Center>
                      <CircularProgress
                        size={7}
                        isIndeterminate
                        color="green.500"
                        m={1}
                      />
                    </Center>
                  </Flex>
                ) : (
                  <Button
                    bg="green.500"
                    color="white"
                    width="full"
                    mt={4}
                    onClick={submitForm}
                  >
                    Sign In
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Flex>
  );
}

export default Login;
