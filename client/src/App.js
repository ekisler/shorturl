import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Navbar from "./components/navbar/Navbar";

import { Routes, Route } from "react-router-dom";

import CreateStudent from "./components/Student/Create-Student.Component";
import EditStudent from "./components/Student/Edit-Student.Component";
import StudentList from "./components/Student/Student-List.Component";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CreateStudent />} />
        <Route path="/create-student" element={<CreateStudent />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
        <Route path="/student-list" element={<StudentList />} />
      </Routes>
    </>
  );
}

export default App;
