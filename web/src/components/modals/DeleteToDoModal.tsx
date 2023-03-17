import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { IToDo } from "../../pages/ToDo";

interface Props {
  isOpen: any;
  onClose: any;
  todo: IToDo;
  deleteTask: (id: string) => void;
}

const DeleteToDoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  todo,
  deleteTask,
}) => {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Message Delete Conformation</ModalHeader>
        <ModalCloseButton disabled={busy} />
        <ModalBody>
          <Text color="red">"Are sure to delete this ToDo ?</Text>
          <Text>{get(todo, "title")}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} disabled={busy}>
            Close
          </Button>
          <Button
            colorScheme="red"
            variant={"outline"}
            mr={3}
            onClick={async () => {
              setBusy(true);
              try {
                await axios({
                  method: "DELETE",
                  url: `${process.env.REACT_APP_BASE_URL}/todo/${get(
                    todo,
                    "id"
                  )}`,
                  headers: {
                    authorization: localStorage.getItem("token"),
                  },
                  withCredentials: true,
                });
                if (todo.id) {
                  deleteTask(todo.id);
                }
                toast({
                  title: "Success",
                  description: "Todo deleted successfully",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              } catch (error) {
                toast({
                  title: "Error",
                  description: get(error, "message"),
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
              onClose();
            }}
            disabled={busy}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default DeleteToDoModal;
