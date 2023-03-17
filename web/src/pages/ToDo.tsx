import React, { useEffect, useState } from "react";
import {
  HStack,
  Box,
  VStack,
  IconButton,
  Flex,
  Text,
  StackDivider,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";

import axios from "axios";
import { FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import ToDoEditDrawer from "../components/drawer/ToDoEditDrawer";
import DeleteToDoModal from "../components/modals/DeleteToDoModal";

export interface IToDo {
  id?: string;
  title: string;
  description: string;
  status: string; //ENUM TODO, INPROGRESS, DONE
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ToDo = () => {
  const [tasks, setTasks] = useState<IToDo[]>([]);
  const [targetItem, setTargetItem] = useState<IToDo>();

  const updateTask = (item: IToDo) => {
    setTasks((prev) => {
      const newTasks = prev.map((task) => {
        if (task.id === item.id) {
          return item;
        }
        return task;
      });
      return newTasks;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const newTasks = prev.filter((task) => task.id !== id);
      return newTasks;
    });
  };

  const addTask = (item: IToDo) => {
    setTasks((prev) => {
      const newTasks = [...prev, item];
      return newTasks;
    });
  };

  const fetchTasks = async () => {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL}/todo`,
      withCredentials: true,
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });
    setTasks(response.data.todos);
  };
  console.log(tasks);

  useEffect(() => {
    fetchTasks();
  }, []);

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const viewItem = (item: IToDo) => {
    setTargetItem(item);
    onViewOpen();
  };

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const deleteItem = (item: IToDo) => {
    setTargetItem(item);
    onDeleteOpen();
  };

  if (!tasks.length) {
    return (
      <>
        <Box maxW="80%">
          <p>Loading...</p>
        </Box>
      </>
    );
  }

  return (
    <>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        height={"100vh"}
        flexDirection={"column"}
      >
        <Box mb={3}>
          <IconButton
            icon={<FiPlus />}
            isRound={true}
            aria-label="Add Task"
            onClick={() => {
              onViewOpen();
              setTargetItem(undefined);
            }}
            mr={3}
          />
          Add Task
        </Box>
        <VStack
          divider={<StackDivider />}
          borderColor="gray.100"
          borderWidth="2px"
          p="5"
          borderRadius="lg"
          w="100%"
          maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "30vw" }}
          alignItems="stretch"
        >
          {tasks.map((task) => {
            return (
              <HStack
                key={task.id}
                opacity={task.status === "true" ? "0.2" : "1"}
              >
                <Text w="100%" p="8px" borderRadius="lg" cursor="pointer">
                  {task.title}
                </Text>
                <Text w="100%" p="8px" borderRadius="lg" cursor="pointer">
                  {task.description}
                </Text>
                <Spacer />
                <IconButton
                  icon={<FiEye />}
                  isRound={true}
                  aria-label="Update Task"
                  onClick={() => viewItem(task)}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  isRound={true}
                  aria-label="Delete Task"
                  onClick={() => deleteItem(task)}
                />
              </HStack>
            );
          })}
        </VStack>
      </Flex>
      {isViewOpen && (
        <ToDoEditDrawer
          isOpen={isViewOpen}
          onClose={onViewClose}
          todo={targetItem}
          updateTask={updateTask}
          addTask={addTask}
        />
      )}
      {isDeleteOpen && targetItem && (
        <DeleteToDoModal
          todo={targetItem}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          deleteTask={deleteTask}
        />
      )}
    </>
  );
};

export default ToDo;
