import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../App";
import {Link} from "react-router-dom"

export default function Home() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  
  useEffect(() => {
    fetch("/allPosts", {
      headers: {
        Authorization: "minnmawoo " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  //---------------------------Like && unLike--------------------//
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "minnmawoo " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "minnmawoo " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };
  //-------------------------comment-----------------------------//

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "minnmawoo " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  //--------------------------delete post-----------------------------//
  const deletePost = (postId) => {
    fetch(`/deletePost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "minnmawoo " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{padding: "5px"}}>
              <Link to={item.postedBy._id !== state.id? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>
              
              {item.postedBy._id == state.id && (
                <i
                  className="material-icons"
                  style={{ float: "right", cursor: "pointer" }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="image-card">
              <img className="img-card" src={item.photo} key={item._id} />
            </div>
            <div className="card-content">
            <p style={{ fontWeight: "600", color: "blue", marginBottom: "10px", marginTop: "-15px"}}>{item.body}</p>
              {/* HEART */}
              {item.likes.includes(state.id) ? (
                <i className="material-icons" style={{ color: "red" }}>
                  favorite
                </i>
              ) : (
                <i className="material-icons" style={{ color: "grey" }}>
                  favorite
                </i>
              )}
              {/* HEART END */}
              {/* LIKE && UNLIKE */}
              {item.likes.includes(state.id) ? (
                <i
                  className="material-icons"
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}
              {/* LIKE && UNLIKE END*/}
              <h6>{item.likes.length} likes</h6> {/* LIKE COUNT */}
              
              {/* COMMENT DISPLAY */}
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "600" }}>
                      {record.postedBy.name}{" "}
                    </span>
                    {record.text}
                  </h6>
                );
              })}
              {/* COMMENT DISPLAY END*/}
              {/* COMMENT INPUT */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder="add comment" />
                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    name="action"
                  >
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </form>
              {/* COMMENT INPUT END*/}
            </div>
          </div>
        );
      })}
    </div>
  );
}
