import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPencilAlt, faTrashAlt, faThumbsUp, faHeart, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/comments");
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedComment = { username, comment };
        await axios.put(`http://localhost:8080/api/comments/${isEditing}`, updatedComment);
        setIsEditing(null);
      } else {
        const newComment = { username, comment };
        await axios.post("http://localhost:8080/api/comments", newComment);
      }
      fetchComments();
      setUsername("");
      setComment("");
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${id}`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const handleEdit = (comment) => {
    setIsEditing(comment.id);
    setUsername(comment.username);
    setComment(comment.comment);
  };

  const handleReaction = async (id, type) => {
    try {
      await axios.post(`http://localhost:8080/api/comments/${id}/react`, { type });
      fetchComments(); // Reload the comments after reaction
    } catch (error) {
      console.error("Error reacting to comment", error);
    }
  };

  return (
    <>
      <div className="logo-container">
        <img
          src="/Room.png"
          alt="Chat Room Logo"
          className="chat-logo"
        />
      </div>
      <div className="chat-container">
        <div className="chat-box">
          <div className="messages-container">
            {loading ? (
              <p>Loading comments...</p>
            ) : (
              <ul className="list-group messages-list">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <strong>{c.username}</strong>: {c.comment}
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="reactions-container" style={{ marginRight: "10px" }}>
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="reaction-icon like-icon"
                          style={{ color: "blue", marginRight: "10px", cursor: "pointer" }}
                          onClick={() => handleReaction(c.id, "like")}
                        />
                        <span>{c.likes}</span>

                        <FontAwesomeIcon
                          icon={faHeart}
                          className="reaction-icon love-icon"
                          style={{ color: "red", marginRight: "10px", cursor: "pointer",}}
                          onClick={() => handleReaction(c.id, "love")}
                        />
                        <span>{c.loves}</span>

                        <FontAwesomeIcon
                          icon={faThumbsDown}
                          className="reaction-icon dislike-icon"
                          style={{ color: "gray", cursor: "pointer" }}
                          onClick={() => handleReaction(c.id, "dislike")}
                        />
                        <span>{c.dislikes}</span>
                      </div>
                      <div className="dots-container">
                        <button
                          className="dots-btn"
                          onClick={() => document.getElementById(c.id).classList.toggle('show-actions')}
                        >
                          ⫶
                        </button>
                        <div className="message-actions" id={c.id}>
                          <button
                            className="btn btn-sm edit-btn"
                            onClick={() => handleEdit(c)}
                          >
                            <FontAwesomeIcon icon={faPencilAlt} /> Edit
                          </button>
                          <button
                            className="btn btn-sm delete-btn"
                            onClick={() => handleDelete(c.id)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <textarea
              className="form-control"
              rows="1"
              placeholder="Enter your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default App;
