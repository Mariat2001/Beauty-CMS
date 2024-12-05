import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, upload, updateImage, getStorageRef } from "../Firebase";
import { getDownloadURL } from "firebase/storage";

function Slideshow1({ isSidebarOpen, sidebarWidth = 250 }) {
    const currentUser = useAuth();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [imgnb, setImgnb] = useState("");
    const [slideshow, setSlideshow] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [photoURL, setPhotoURL] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [id, setId] = useState(null);
    const [imageName, setImageName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagenberror, setImagenberror] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [slideshowImages, setslideshowImages] = useState({});
    const [imageError, setImageError] = useState("");
   
    const itemsPerPage = 4;
  
    const filteredSlideshow = slideshow.filter((slideshow) => {
      const regex = new RegExp(filter, "i"); // 'i' flag for case-insensitive
      return (
        regex.test(slideshow.imgnb)
      );
    });

   
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSlideshow = filteredSlideshow.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const totalPages = Math.ceil(filteredSlideshow.length / itemsPerPage);
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const [inputs, setInputs] = useState({
      imgnb: "",
      image: null,
    });

    const contentStyle = {
      marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "70px",
      transition: "margin-left 0.4s ease, width 0.4s ease",
      padding: "20px",
      width: `calc(100% - ${isSidebarOpen ? sidebarWidth : 70}px)`,
    };
  
    useEffect(() => {
      fetchfunction();
    }, []);
  
    const fetchfunction = async () => {
      fetchSlideshow();
     
    };
    const fetchSlideshow = async () => {
      try {
        const response = await axios.post("http://localhost:8081/getslideshow");
        setSlideshow(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching slideshow:", error);
      }
    };
    useEffect(() => {
      // Fetch image URLs for all brands
      slideshow.forEach((slideshow) => {
        console.log(slideshow.image);
        if (slideshow.image) {
          getDownloadURL(getStorageRef(slideshow.image))
            .then((url) => {
              setslideshowImages((prev) => ({ ...prev, [slideshow.id]: url }));
            })
            .catch((error) => console.error("Error fetching image URL:", error));
        }
      });
    }, [slideshow]);
 
  
    const togglePopup = () => {
      setImgnb("");
      setPhoto(null);
      setPhotoURL(null);
      setShowPopup(!showPopup);
      setImagenberror("");
      setImageError("");
    };
  
    const toggleUpdatePopup = async (slideshow) => {
      setId(slideshow.id);
      setInputs({
        imgnb: slideshow.imgnb,
        image: slideshow.image,
      });
    console.log(slideshow.imgnb  )
    console.log(slideshow.image  )
      setImgnb(slideshow.imgnb);
     
    
      if (slideshow.image) {
        try {
          const url = await getDownloadURL(getStorageRef(slideshow.image));
          setPhotoURL(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      } else {
        setPhotoURL(null);
      }
    
      setShowUpdatePopup(true);
      setImageName(slideshow.image ? slideshow.image.split("/").pop() : "");
    
      setImagenberror("");
      setImageError("");
    };
  
    const handleChange = (e) => {
      if (e.target.files[0]) {
        const selectedPhoto = e.target.files[0];
        setPhoto(selectedPhoto);
        const imageURL = URL.createObjectURL(selectedPhoto);
        setPhotoURL(imageURL);
      }
    };
  
    const handleChangeUpdate = (e) => {
      const { name, value, files } = e.target;
      if (files && files[0]) {
        setImageFile(files[0]);
        const imageURL = URL.createObjectURL(files[0]);
        setPhotoURL(imageURL);
      } else {
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: value,
        }));
      }
    };

    
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        let newImageUrl = null;
        if (imageFile) {
          // Pass the old image path to updateImage
          newImageUrl = await updateImage(imageFile, inputs.image, setLoading);
        }
  
        const updatedSlideshowData = {
          imgnb: inputs.imgnb, 
          imageUrl: newImageUrl || inputs.image,
          // Use existing image if no new image
        };
       console.log( `http://localhost:8081/updateslideshow/${id}`,
          updatedSlideshowData)
  
        const response = await axios.put(
          `http://localhost:8081/updateslideshow/${id}`,
          updatedSlideshowData
        );
        console.log(response)
        if (response.status === 200) {
          alert("Slideshow updated successfully");
          fetchSlideshow(); // Fetch the updated list of brands
          handleCloseUpdatePopup(); // Close the popup after update
        } else {
          alert("Error updating slideshow");
        }
      } catch (error) {
        console.error("Error updating slideshow:", error);
        alert(
          "Error updating slideshow: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async (slideshowId) => {
      try {
        const response = await axios.delete(
          `http://localhost:8081/deleteslideshow/${slideshowId}`
        );
        console.log(slideshowId);
        if (response.status === 200) {
          alert("Brand deleted successfully");
          fetchSlideshow(); // Fetch the updated list of brands
        } else {
          alert("Error deleting slideshow");
        }
      } catch (error) {
        console.error("Error deleting slideshow:", error);
        alert("Error deleting slideshow");
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      console.log("Image number:", imgnb);
      setImagenberror("");
      setImageError("");
  
      let isValid = true;
      if (!imgnb) {
        setImagenberror("Image number is required");
        isValid = false;
      }
   
  
      if (!photo) {
        setImageError("Image is required");
        isValid = false;
      }
      // If any field is invalid, do not proceed
      if (!isValid) return;
  
      let imageUrl = "";
      if (photo) {
        setLoading(true);
        try {
          imageUrl = await upload(photo, currentUser, setLoading);
        } catch (error) {
          console.error("Error uploading file:", error);
          setLoading(false);
          return;
        }
      }
  
      const formData = {
        imgnb,
        imageUrl,
      };
      console.log(formData)
      try {
        const response = await axios.post(
          "http://localhost:8081/addslideshow",
          formData
        );
        togglePopup();
        fetchSlideshow();
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    };
  
    const handleCloseUpdatePopup = () => {
      setShowUpdatePopup(false);
      setInputs({
        imgnb: "",
        image: null,
      });
      setImageFile(null); // Reset the imageFile state
    };
  return (
    <div style={contentStyle}>
    <section className="content">
      <div className="col-sm-6 offset-sm-3">
        <br />
        <input
          type="text"
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          style={{
            marginTop: "21px",
            marginBottom: "-30px",
            marginLeft: isSidebarOpen ? "240%" : "295%",
          }}
          placeholder="Search Slideshow..."
        />
      </div>
      <button
        className="btnAddHome"
        style={{
          backgroundColor: "#e29c89",
          color: "white",
          marginLeft: "86%",
          marginTop: "-21.18px",
          marginBottom: "21px",
          width: "100px",
        }}
        onClick={togglePopup}
      >
        Add
      </button>
      <div className="tbl-header" style={{width:'60%'}}>
        <table
          cellPadding="0"
          cellSpacing="0"
          border="0"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th className="header">Slideshow Number</th>
              <th className="header">Image</th>
              <th className="header">Action</th>
            </tr>
          </thead>

          <tbody>
            
            {currentSlideshow.map((slideshow, index) => (
              
              <tr key={index}>
                 <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {slideshow.imgnb}
                </td>

                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {slideshowImages[slideshow.id] ? (
                    <img
                      src={slideshowImages[slideshow.id]}
                      alt={slideshow.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    <span>Loading...</span>
                  )}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#e29c89",
                      color: "white",
                      width: "70px",
                      height: "32px",
                    }}
                    onClick={() => handleDelete(slideshow.id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{
                      marginLeft: "5px",
                      backgroundColor: "#e29c89",
                      color: "white",
                      width: "70px",
                      height: "32px",
                    }}
                    onClick={() => toggleUpdatePopup(slideshow)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{
            marginRight: "10px",
            backgroundColor: "#e29c89",
            color: "white",
            padding: "5px 10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Previous
        </button>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const pageNumber = Math.min(
                  Math.max(Number(currentPage), 1),
                  totalPages
                );
                setCurrentPage(pageNumber);
              }
            }}
            style={{
              width: "50px",
              textAlign: "center",
              marginRight: "5px",
              padding: "5px",
              border: "1px solid #ccc",
            }}
          />
          <span>/ {totalPages}</span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            marginLeft: "10px",
            backgroundColor: "#e29c89",
            color: "white",
            padding: "5px 10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>

      {showPopup && (
        <div className="popup-container" style={{ width: "20%" }}>
          <div className="popup">
            <h2 className="label">Add Slideshow</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                {imagenberror && (
                  <div
                    className="error"
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      color: "red",
                      marginLeft: "185px",
                    }}
                  >
                    {imagenberror}
                  </div>
                )}
                <br />
                <input
                  type="number"
                  className="addInputs1"
                  value={imgnb}
                  style={{
                    marginLeft: "50px",
                    marginRight: "45px",
                    backgroundColor: imagenberror
                      ? "rgba(255, 0, 0, 0.1)"
                      : "transparent",
                    border: imagenberror ? "1px solid red" : "1px solid black", // Red transparent background if there's an error
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault(); 
                    }
                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const parsedValue = parseInt(inputValue, 10);

                    if (!isNaN(parsedValue) && parsedValue > 0) {
                      setImgnb(parsedValue); 
                    } else if (inputValue === "") {
                      setImgnb(""); 
                    }
                  }}
                  name="imgnb"
                  placeholder="Slideshow Number"
                />

                <br />
              </div>
              <input
                type="file"
                className="file"
                style={{ marginTop: "40px" ,marginLeft:"60px"}}
                onChange={handleChange}
              />
              <br />
              {imageError && (
                <div
                  className="error"
                  style={{
                    fontSize: "12px",
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {imageError}
                </div>
              )}

              {photoURL ? (
                <div
                  style={{
                    marginTop: "20px",
                    marginLeft: "108px",
                    width: "90px",
                    height: "90px",
                    border: "1px solid #ccc",
                    overflow: "hidden", // Ensure the image doesn’t overflow the box
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={photoURL}
                    alt="Selected"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Ensure the image covers the box
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: imageError
                    ? "rgba(255, 0, 0, 0.1)"
                    : "transparent",
                    marginTop: "20px",
                    marginLeft: "108px",
                    width: "90px",
                    height: "90px",
                   border: imageError ? "1px solid red" : "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  No Image
                </div>
              )}
              <br />
              <button className="AddBtn" disabled={loading}>
                {loading ? "Uploading..." : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showUpdatePopup && (
        <div className="popup-container" style={{ width: "20%" }}>
          <div className="popup">
            <h2 className="label" style={{marginLeft:"40px"}}>Update Slideshow</h2>
            <form onSubmit={handleUpdate}>
               <div className="input-group">
                 
                {imagenberror && (
                  <div
                    className="error"
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      color: "red",
                      marginLeft: "185px",
                    }}
                  >
                    {imagenberror}
                  </div>
                )}
                <br />
                <input
  type="number"
  className="addInputs1"
  value={imgnb}
  style={{
    marginLeft: "50px",
    marginRight: "45px",
    backgroundColor: imagenberror ? "rgba(255, 0, 0, 0.1)" : "transparent",
    border: imagenberror ? "1px solid red" : "1px solid black", 
  }}
  onKeyDown={(e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  }}
  onChange={(e) => {
    const inputValue = e.target.value;
    const parsedValue = parseInt(inputValue, 10);

    if (!isNaN(parsedValue) && parsedValue > 0) {
      setImgnb(parsedValue); // Update the img number
      setInputs((prevState) => ({ ...prevState, imgnb: parsedValue })); // Update inputs state
    } else if (inputValue === "") {
      setImgnb(""); // Clear the img number
      setInputs((prevState) => ({ ...prevState, imgnb: "" })); // Clear inputs state
    }
  }}
  name="imgnb"
  placeholder="imgnb"
/>


                <br />
              </div>

              <input
                type="file"
                name="image"
                onChange={handleChangeUpdate}
                style={{ marginTop: "40px" ,marginLeft:"60px"}}
              />

              {imageError && (
                <div
                  className="error"
                  style={{
                    fontSize: "12px",
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {imageError}
                </div>
              )}
              {photoURL ? (
                <div className="image-container">
                  <img src={photoURL} alt="Selected Image" />
                </div>
              ) : (
                <div className="image-container">
                  <span className="no-image-text">No Image</span>
                </div>
              )}

              <br />
              <button
                type="submit"
                style={{
                  backgroundColor: "#e29c89",
                  color: "white",
                  width: "70px",
                  height: "32px",
                  marginLeft: "118px",
                }}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
    {showPopup && <div className="backdrop" onClick={togglePopup} />}
    {showUpdatePopup && (
      <div className="backdrop" onClick={handleCloseUpdatePopup} />
    )}
  </div>
  )
}

export default Slideshow1
