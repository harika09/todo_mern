import React, { useState, useEffect } from "react";
import "./Home.css";
import Axios from "axios";
import TodoList from "../TodoList/TodoList";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";

const useStyle = makeStyles((theme) => ({
  /* Fab Button  */
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: "relative",
    minHeight: 200,
  },
  fab: {
    position: "absolute",
    left: "50%",
  },
}));

function Home() {
  const [isloading, setLoading] = useState(true);
  const [todolist, setTodolist] = useState([]);
  const classes = useStyle();
  const [click, setClick] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const showModal = () => setClick(!click);

  const hideModal = () => setClick(false);

  const successMessage = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Task has been added",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const errorMessage = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Fields cannot be empty",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  /* Load Task */
  const loadTodo = async () => {
    Axios.get("http://localhost:4000/post").then((response) => {
      setTodolist(response.data);
      setLoading(false);
    });
  };

  const submitTask = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      errorMessage();
    } else {
      Axios.post("http://localhost:4000/post/data", {
        title: title,
        content: content,
      }).then((response) => {
        if (response.data.error) {
          errorMessage();
        } else {
          setTitle("");
          setContent("");
          successMessage();
          loadTodo();
          hideModal();
        }
      });
    }
  };

  useEffect(() => {
    loadTodo();
  }, []);
  return (
    <div className="home-container">
      <div className="home-content bd-container">
        <h1>Mern Todo List</h1>
        <div className="fab-icon">
          <Fab
            color="primary"
            aria-label="add"
            className="fab"
            // className={classes.fab}
            onClick={() => {
              showModal();
            }}
          >
            <AddIcon />
          </Fab>
        </div>

        {/* Modal Here */}
        <div className={click ? "modal active" : "modal"} id="task-modal">
          <div className="task-modal-content">
            <span
              className="close"
              onClick={() => {
                hideModal();
              }}
            >
              &times;
            </span>
            <h3>Add Task</h3>

            <div className="task-form">
              <form onSubmit={submitTask}>
                <label htmlFor="title">Task Name</label>
                <input
                  type="text"
                  className="title"
                  placeholder="Enter Task Name"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />

                <label htmlFor="content">Task Details</label>
                <input
                  type="text"
                  className="content"
                  placeholder="Enter Task Details"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                />

                <input type="submit" value="Add Task" />
              </form>
            </div>
          </div>
        </div>

        <div className="data-container">
          {isloading ? (
            <div className="loading">
              <BeatLoader loading color="#e98580" />
            </div>
          ) : (
            <TodoList data={todolist} setPost={setTodolist} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;