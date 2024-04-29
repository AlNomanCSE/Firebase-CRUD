"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type DataType = {
  details: string;
  title: string;
  done: boolean;
};

const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DataType>();
  const onSubmit: SubmitHandler<DataType> = async (data: DataType) => {
    await fetch(
      `http://127.0.0.1:5001/todo-5d1c1/us-central1/updateTodo/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: data.title,
          details: data.details,
          done: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    window.alert("Updated.....!");
    router.push("/");
  };
  useEffect(() => {
    //?if id is not defined
    if (!id) return;

    const fetchTodo = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5001/todo-5d1c1/us-central1/getTodo/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Reset form with new default values
        reset({ title: data.title, details: data.details });
      } catch (error) {
        console.log(error);
      }
    };

    fetchTodo();
  }, [id, reset]);

  return (
    <div className="flex gap-4 justify-center items-center h-screen">
      <div className="bg-[#7a368b] w-[600px] rounded-lg p-8">
        <h1 className="py-4 px-4 text-center text-slate-300 font-bold">Update Todo</h1>
        <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
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
            <button className="bg-white p-2 rounded-md text-gray-900 font-bold shadow-2xl my-4">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
