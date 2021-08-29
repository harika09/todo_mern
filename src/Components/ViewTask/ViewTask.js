import React from "react";

function ViewTask({ data }) {
  return (
    <>
      <strong className="task-details">Task Details</strong>

      <div className="task-info">
        <h2>{data.title}</h2>
        <p>{data.content}</p>
      </div>
    </>
  );
}

export default ViewTask;
