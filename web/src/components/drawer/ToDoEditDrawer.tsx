import React, { useMemo, useState } from "react";
import { IToDo } from "../../pages/ToDo";
import * as Yup from "yup";
import {
  Alert,
  AlertTitle,
  Button,
  Drawer,
  DrawerBody,
  IconButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { MdModeEditOutline } from "react-icons/md";
import { Form, Formik } from "formik";
import { get } from "lodash";
import { FormField } from "../formField/FormField";
import { FormFieldTextArea } from "../formField/FormFieldTextArea";
import axios from "axios";

interface Props {
  todo?: IToDo;
  isOpen: any;
  onClose: any;
  addTask: (item: IToDo) => void;
  updateTask: (item: IToDo) => void;
}

const addSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(
      ["TODO", "INPROGRESS", "DONE"],
      "Status must be TODO, INPROGRESS or DONE"
    ),
});

const ToDoEditDrawer: React.FC<Props> = ({
  todo,
  isOpen,
  onClose,
  addTask,
  updateTask,
}) => {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [isDisabled, setDisabled] = useState(!!(todo && todo.id));

  const initialValue = useMemo(() => {
    if (todo) {
      return {
        title: todo.title,
        description: todo.description,
        status: todo.status,
      };
    }
    return {
      title: "",
      description: "",
      status: "",
    };
  }, [todo]);

  const onSubmit = async (values: Record<string, any>) => {
    setBusy(true);
    console.log(values);
    if (!todo) {
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/todo`,
        withCredentials: true,
        headers: {
          authorization: localStorage.getItem("token"),
        },
        data: {
          title: values.title,
          description: values.description,
          status: values.status,
        },
      }).then((response: any) => {
        console.log(response);
        addTask(response.data.todo);
        toast({
          title: "Task Created",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      });
    } else {
      await axios({
        method: "PATCH",
        url: `${process.env.REACT_APP_BASE_URL}/todo/${todo.id}`,
        withCredentials: true,
        headers: {
          authorization: localStorage.getItem("token"),
        },
        data: {
          title: values.title,
          description: values.description,
          status: values.status,
        },
      }).then((response: any) => {
        console.log(response);
        updateTask(response.data.todo);
        toast({
          title: "Task updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      });
    }
  };

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={addSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, submitForm, setFieldValue }) => (
        <Form>
          <Drawer
            isOpen={isOpen}
            placement="right"
            size={"md"}
            onClose={onClose}
            closeOnOverlayClick={busy}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader backgroundColor={"gray.100"} alignItems={"stretch"}>
                <Flex>
                  {get(todo, "title") || "Add Task"}
                  <Spacer></Spacer>
                  {todo && todo.id && (
                    <IconButton
                      aria-label="update link"
                      key={"updateLinkButton"}
                      alignSelf={"end"}
                      onClick={() => {
                        setDisabled(!isDisabled);
                      }}
                      icon={<MdModeEditOutline />}
                    ></IconButton>
                  )}
                </Flex>
              </DrawerHeader>
              <DrawerBody>
                <FormField
                  required={true}
                  disabled={isDisabled}
                  name="Title : "
                  fieldName="title"
                  type="text"
                  error={touched.title ? (errors.title as string) : undefined}
                />

                <FormFieldTextArea
                  disabled={isDisabled}
                  required={false}
                  name="Description : "
                  fieldName="description"
                  type="text"
                  error={
                    errors.description
                      ? (errors.description as string)
                      : undefined
                  }
                />

                <FormField
                  disabled={isDisabled}
                  required={false}
                  name="Status : "
                  fieldName="status"
                  type="text"
                  error={errors.status ? (errors.status as string) : undefined}
                />
              </DrawerBody>
              <DrawerFooter backgroundColor={"gray.100"}>
                <Button
                  variant="outline"
                  mr={3}
                  onClick={onClose}
                  disabled={busy}
                >
                  Close
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={submitForm}
                  disabled={busy || isDisabled}
                >
                  {todo && todo.id ? "Update" : "Save"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default ToDoEditDrawer;
