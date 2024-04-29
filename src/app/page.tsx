"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type DataType = {
  details: string;
  title: string;
  done: boolean;
};

type finalData = DataType & {
  id: string;
};
export default function Home() {
  const [todos, setTodos] = useState<finalData[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DataType>();
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5001/todo-5d1c1/us-central1/getTodos"
        );
        const data: finalData[] = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos: ", error);
      }
    };

    fetchTodos();
  }, []);

  const onSubmit: SubmitHandler<DataType> = async (data: DataType) => {
    await fetch("http://127.0.0.1:5001/todo-5d1c1/us-central1/addTodo", {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        details: data.details,
        done: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await fetch(
      "http://127.0.0.1:5001/todo-5d1c1/us-central1/getTodos"
    );
    const Data: finalData[] = await response.json();
    setTodos(Data);
    reset();
  };
  async function handleDelete(id: string) {
    try {
      await fetch(
        `http://127.0.0.1:5001/todo-5d1c1/us-central1/deleteTodo/${id}`,
        {
          method: "DELETE",
        }
      );

      const response = await fetch(
        "http://127.0.0.1:5001/todo-5d1c1/us-central1/getTodos"
      );
      const Data: finalData[] = await response.json();
      setTodos(Data);
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  }

  return (
    <div className="flex gap-4 justify-center items-center h-screen">
      <div className="bg-[#4e84aa] w-[600px] rounded-lg p-8">
        <h1 className="p-4 text-amber-950 font-bold text-center">
          Add New Todo
        </h1>
        <form className="p-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block mb-2 text-white font-bold">Task Name</label>
          <input
            type="text"
            {...register("title", {
              required: { value: true, message: "Title is required" },
              maxLength: {
                value: 20,
                message: "Title should be under 20 charecter",
              },
            })}
            className="border p-2 mb-4 w-full rounded-lg"
          />
          <p className="text-red-500">{errors.title?.message}</p>
          <label className="block mb-2 text-white font-bold">
            Task Details
          </label>
          <textarea
            {...register("details", {
              required: { value: true, message: "Detailes is required" },
              minLength: {
                value: 15,
                message: "Details should be More then 20 charecter",
              },
            })}
            className="border p-2 w-full rounded-lg"
          ></textarea>
          <p className="text-red-500">{errors.details?.message}</p>
          <div className="flex justify-end">
            <button className="bg-white px-4 py-2 rounded-md text-gray-900 font-bold shadow-2xl my-4 tracking-wider">
              ADD
            </button>
          </div>
        </form>
      </div>
      <div className="p-8 w-[500px]">
        <h1 className="p-2 m-2 text-amber-950 font-bold border text-center">
          Todo List
        </h1>
        {todos.map((datum, index) => (
          <div
            key={index}
            className="m-4 flex flex-col gap-3 border border-dashed rounded-lg p-2 "
          >
            <div>
              Title: <span className="font-bold">{datum.title}</span>
            </div>
            <p className="text-gray-700">{datum.details}</p>
            <div className="p-2 flex gap-3 justify-between w-[400px]">
              <button
                onClick={() => handleDelete(datum.id)}
                className="shadow-2xl"
              >
                <div className="flex justify-center items-center border px-2 py-[7px] rounded-xl bg-slate-600">
                  <p>Delete</p>
                  <img
                    width="30"
                    height="30"
                    src="https://img.icons8.com/plasticine/100/filled-trash.png"
                    alt="filled-trash"
                  />
                </div>
              </button>
              <Link href={`http://localhost:3000/${datum.id}`}>
                <div className="flex justify-center items-center border px-2 py-[7px] rounded-xl shadow-2xl bg-green-600">
                  <p>Edite</p>
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/fluency/48/pen.png"
                    alt="pen"
                  />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
