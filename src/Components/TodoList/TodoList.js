import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { CardActions } from "@material-ui/core";
import moment from "moment";
import Swal from "sweetalert2";
import Axios from "axios";

function TodoList({ data, setPost }) {
  const [state, setState] = useState({});
  const [todos, setTodos] = useState({});

  const [click, setClick] = useState(false);

  const showModal = () => setClick(!click);

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
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonColor: "#FF6767",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:4000/post/delete/${id}`).then(
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

    Axios.post(`http://localhost:4000/post/edit/${_id}`, {
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
              <Typography>{todos.title}</Typography>
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
