"use client";
import { useEffect, useState } from "react";
import { fetchTodos } from "../controlers/firebaseControler";
type Todo = {
  title: string;
  details: string;
  done: boolean;
};
const DataFatching = () => {
  const [data, setData] = useState<Todo[]>([]);
  useEffect(() => {
    
  }, []);
  return (
    <div>
      {data?.map((datum: Todo, index: number) => (
        <div key={index}>
          <h2>{datum.title}</h2>
          <p>{datum.details}</p>
        </div>
      ))}
    </div>
  );
};

export default DataFatching;
