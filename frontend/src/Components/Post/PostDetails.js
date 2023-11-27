import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Loader from "../Layout/Loader";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const PostDetails = () => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const { id } = useParams();

  const postDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/post/${id}`);
      if (!res.data) {
        setError("Post not found");
      }
      setPost(res.data.post);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError("Error fetching post details");
      setLoading(false); // Make sure to set loading to false in case of an error
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    postDetails(id);
  }, [id, error, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container my-5" style={{ maxHeight: "100%" }}>
                  <h1 className="my-4 text-left" id="titlePage">{post.title}</h1>
            <hr style={{ marginBottom: "5%" }}/>

          <div className="container mt-5">
            <Card
              sx={{
                maxWidth: "lg",
                position: "relative",
                WebkitBoxShadow: "0px 22px 22px 0px rgba(0,0,0,0.55)",
                boxShadow: "0px 22px 22px 0px rgba(0,0,0,0.55)",
                
              }}
            >
              {post.images.map((image, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  height="600"
                  image={image.url}
                  alt={post.title}
                  sx={{backgroundColor: "#333333 "}}
                />
              ))}

              <CardContent>
                <Typography variant="h3" color="text.primary">
                  {post.title}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  {post.location}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                style={{ zIndex: "2000" }}
              >
                <hr/>

                <CardContent>
                  <Typography paragraph>{post.content}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetails;
