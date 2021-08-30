import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { CardActions } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ViewTask from "../ViewTask/ViewTask";
import moment from "moment";
import Swal from "sweetalert2";
import Axios from "axios";

function TodoList({ data, setPost }) {
  const [state, setState] = useState({});
  const [todos, setTodos] = useState({});
  const [viewTask, setViewTask] = useState(false);
  const [click, setClick] = useState(false);

  const showModal = () => setClick(!click);
  const showTask = () => setViewTask(!viewTask);
  const hideTask = () => setViewTask(false);

  const hideModal = () => setClick(false);

  const successMessage = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Task has been updated",
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

  const btnComplete = (id) => {
    Swal.fire({
      title: "Task complete?",
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,

      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(
          `https://react-task-todolist.herokuapp.com/post/delete/${id}`
        ).then(
          setPost(
            data.filter((value) => {
              return value._id !== id;
            })
          )
        );
      }
    });
  };

  const updateTask = (e) => {
    const { _id, title, content } = todos;
    e.preventDefault();

    Axios.post(`https://react-task-todolist.herokuapp.com/post/edit/${_id}`, {
      title: title,
      content: content,
    }).then((response) => {
      if (response.data.success) {
        setPost(
          data.map((val) => {
            return val._id === _id
              ? { _id: _id, title: title, content: content }
              : val;
          })
        );

        successMessage();
      } else {
        errorMessage();
      }
    });
  };

  return (
    <div className="card">
      {data.map((todos) => {
        return (
          <Card
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              margin: "10px",
            }}
          >
            <CardContent>
              <h3>{todos.title.substring(0, 18)}</h3>
              <Typography
                className="classes.timestamp"
                style={{ fontSize: "0.6rem" }}
              >
                {moment(todos.timestamp).fromNow()}
              </Typography>
            </CardContent>

            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  showTask();
                  setState(todos);
                }}
              >
                <VisibilityIcon />
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  showModal();
                  setState(todos);
                  setTodos(todos);
                }}
              >
                <EditRoundedIcon />
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  btnComplete(todos._id);
                }}
              >
                <CheckCircleOutlineRoundedIcon />
              </Button>
            </CardActions>
          </Card>
        );
      })}

      {Object.keys(state).length > 0 ? (
        <div className={viewTask ? "modal active" : "modal"}>
          <div className="task-modal-content">
            <span
              className="close"
              onClick={() => {
                hideTask();
              }}
            >
              &times;
            </span>
            <div className="task-information">
              <ViewTask data={state} />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {Object.keys(todos).length > 0 ? (
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
            <h3>Edit Task</h3>

            <div className="task-form">
              <form onSubmit={updateTask}>
                <label htmlFor="title">Task Name</label>
                <input
                  type="text"
                  className="title"
                  name="title"
                  placeholder="Enter Task Name"
                  onChange={(e) =>
                    setTodos({
                      ...todos,
                      [e.target.name]: e.target.value,
                    })
                  }
                  value={todos.title}
                />

                <label htmlFor="content">Task Details</label>
                <input
                  type="text"
                  className="content"
                  name="content"
                  placeholder="Enter Task Details"
                  value={todos.content}
                  onChange={(e) =>
                    setTodos({
                      ...todos,
                      [e.target.name]: e.target.value,
                    })
                  }
                />

                <input type="submit" value="Update Task" />
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TodoList;
