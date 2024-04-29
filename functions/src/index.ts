import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello ..!", { structuredData: true });
  response.send("Hello from Noman ......------ Firebase!");
});

export const getTodos = onRequest(async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).send("Please send a get request");
    return;
  }
  const db = admin.firestore();
  const todosCollection = db.collection("todos");
  try {
    const snapshot = await todosCollection.get();
    const todos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(todos);
  } catch (error) {
    console.error("Error fetching todos: ", error);
    res.status(500).send("Error fetching todos");
  }
});

export const addTodo = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(400).send("Please send a Post request");
    return;
  }
  const { title, details } = req.body;
  const db = admin.firestore();
  const todosCollection = db.collection("todos");
  try {
    const data = await todosCollection.add({ title, details, done: true });
    res.status(200).send(data);
    // "Todo added successfully",
  } catch (error) {
    console.error("Error adding todo: ", error);
    res.status(500).send("Error adding todo");
  }
});

//!DELETE not working using params
// export const deleteTodo = onRequest(async (req, res) => {
//   if (req.method !== "DELETE") {
//     res.status(400).send("Please send a Delete request");
//     return;
//   }
//   const { id } = req.params;
//   const db = admin.firestore();
//   const todosCollection = db.collection("todos");
//   console.log(id);

//   try {
//     await todosCollection.doc(id).delete();
//     res.status(200).send("Todo deleted successfully");
//   } catch (error) {
//     console.error("Error deleting todo: ", id);
//     res.status(500).send(id);
//   }
// });

export const deleteTodo = onRequest(async (req, res) => {
  if (req.method !== "DELETE") {
    res.status(400).send("Please send a Delete request");
    return;
  }

  //?---------: get the last segment--------
  const id = req.path.split("/").pop();
  if (!id) {
    res.status(400).send("No ID provided in the URL");
    return;
  }
  const db = admin.firestore();
  const todosCollection = db.collection("todos");
  console.log(id);

  try {
    await todosCollection.doc(id).delete();
    res.status(200).send("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo: ", error);
    res.status(500).send(error);
  }
});

export const getTodo = onRequest(async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).send("Please send a GET request");
    return;
  }
  const id = req.path.split("/").pop();
  if (!id) {
    res.status(400).send("No ID provided in the URL");
    return;
  }
  const db = admin.firestore();
  const todosCollection = db.collection("todos");

  try {
    const doc = await todosCollection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send("Todo not found");
      return;
    }
    const todo = { id: doc.id, ...doc.data() };
    res.status(200).send(todo);
  } catch (error) {
    console.error("Error getting todo: ", error);
    res.status(500).send(error);
  }
});


export const updateTodo = onRequest(async (req, res) => {
  if (req.method !== "PUT") {
    res.status(400).send("Please send a PUT request");
    return;
  }
  const id = req.path.split("/").pop();
  if (!id) {
    res.status(400).send("No ID provided in the URL");
    return;
  }
  const { title, details, done } = req.body;
  const db = admin.firestore();
  const todosCollection = db.collection("todos");

  try {
    await todosCollection.doc(id).update({ title, details, done });
    res.status(200).send("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo: ", error);
    res.status(500).send("Error updating todo");
  }
});
