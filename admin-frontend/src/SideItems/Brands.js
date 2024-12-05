import React, { useState, useEffect } from "react";
import "./Brands.css";
import axios from "axios";
import { useAuth, upload, updateImage,getStorageRef  } from "../Firebase";
import { getDownloadURL } from "firebase/storage";


function Brands({ isSidebarOpen, sidebarWidth = 250 }) {
  const currentUser = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [brandImages, setBrandImages] = useState({});
  const itemsPerPage = 4;

  const filteredBrands = brands.filter((brand) => {
    const regex = new RegExp(filter, "i"); // 'i' flag for case-insensitive
    return (
      regex.test(brand.name) ||
      regex.test(brand.description) ||
      regex.test(brand.category)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

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

  const [editBrand, setEditBrand] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    category: "",
    image: null,
  });
  const contentStyle = {
    marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "70px",
    transition: "margin-left 0.4s ease, width 0.4s ease",
    padding: "20px",
    width: `calc(100% - ${isSidebarOpen ? sidebarWidth : 70}px)`,
  };

  useEffect(() => {
    fetchBrands();
    // Log brands to verify their content
  }, []);

  useEffect(() => {
 

    // Fetch image URLs for all brands
    brands.forEach(brand => {
      console.log(brand.image)
      if (brand.image) {
        getDownloadURL(getStorageRef(brand.image))
          .then(url => {
            setBrandImages(prev => ({ ...prev, [brand.id]: url }));
          })
          .catch(error => console.error("Error fetching image URL:", error));
      }
    });
  }, [brands]);

  const fetchBrands = async () => {
    try {
      const response = await axios.post("http://localhost:8081/getbrands");
      setBrands(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const togglePopup = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPhoto(null);
    setPhotoURL(null);

    setNameError("");
    setDescriptionError("");
    setCategoryError("");
    setImageError("");

    setShowPopup(!showPopup);
  };

  const toggleUpdatePopup = async (brand) => {
    setId(brand.id);
    setInputs({
        name: brand.name,
        description: brand.description,
        category: brand.category,
        image: brand.image,
    });
    if (brand.image) {
        try {
            const url = await getDownloadURL(getStorageRef(brand.image)); // Pass brand.image here
            setPhotoURL(url);
        } catch (error) {
            console.error("Error fetching image URL:", error);
        }
    }
    setShowUpdatePopup(true);
    setImageName(brand.image ? brand.image.split("/").pop() : "");

    setNameError("");
    setDescriptionError("");
    setCategoryError("");
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
  
      const updatedBrandData = {
        name: inputs.name,
        description: inputs.description,
        category: inputs.category,
        imageUrl: newImageUrl || inputs.image,
        // Use existing image if no new image
      };
  
      const response = await axios.put(
        `http://localhost:8081/updatebrand/${id}`,
        updatedBrandData
      );
  
      if (response.status === 200) {
        alert("Brand updated successfully");
        fetchBrands(); // Fetch the updated list of brands
        handleCloseUpdatePopup(); // Close the popup after update
      } else {
        alert("Error updating brand");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      alert(
        "Error updating brand: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleDelete = async (brandId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/deletebrand/${brandId}`
      );
      if (response.status === 200) {
        alert("Brand deleted successfully");
        fetchBrands(); // Fetch the updated list of brands
      } else {
        alert("Error deleting brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Error deleting brand");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNameError("");
    setDescriptionError("");
    setCategoryError("");
    setImageError("");

    let isValid = true;
    if (!name) {
      setNameError("Name is required");
      isValid = false;
    }
    if (!description) {
      setDescriptionError("Description is required");
      isValid = false;
    }
    if (!category) {
      setCategoryError("Category is required");
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
      name,
      description,
      category,
      imageUrl,
    };
    try {
      const response = await axios.post(
        "http://localhost:8081/addbrands",
        formData
      );
      togglePopup();
      fetchBrands();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleCloseUpdatePopup = () => {
    setShowUpdatePopup(false);
    setInputs({
      name: "",
      description: "",
      category: "",
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
            placeholder="Search Brand ..."
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
        <div className="tbl-header">
          <table
            cellPadding="0"
            cellSpacing="0"
            border="0"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th className="header">Name</th>
                <th className="header">Description</th>
                <th className="header">Category</th>
                <th className="header">Image</th>
                <th className="header">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentBrands.map((brand, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {brand.name}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {brand.description}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {brand.category}
                  </td>
                  <td style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "center",
              }}>
                {brandImages[brand.id] ? (
                  <img
                    src={brandImages[brand.id]}
                    alt={brand.name}
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
                      onClick={() => handleDelete(brand.id)}
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
                      onClick={() => toggleUpdatePopup(brand)}
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
          <div className="popup-container">
            <div className="popup">
              <h2 className="label">Add Brand</h2>
              <form onSubmit={handleSubmit}>
                {nameError && (
                  <div
                    className="error"
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      color: "red",
                    }}
                  >
                    {nameError}
                  </div>
                )}
                <input
                  type="text"
                  className="addInputs"
                  placeholder="Name"
                  value={name}
                  style={{
                    backgroundColor: nameError
                      ? "rgba(255, 0, 0, 0.1)"
                      : "transparent",
                    border: nameError ? "1px solid red" : "1px solid black", // Red transparent background if there's an error
                  }}
                  onChange={(e) => setName(e.target.value)}
                />

                <br />
                {descriptionError && (
                  <div
                    className="error"
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      marginTop: "5px",
                      color: "red",
                    }}
                  >
                    {descriptionError}
                  </div>
                )}
                <input
                  type="text"
                  className="addInputs"
                  placeholder="Description"
                  value={description}
                  style={{
                    marginRight: "-30px",
                    backgroundColor: descriptionError
                      ? "rgba(255, 0, 0, 0.1)"
                      : "transparent",
                    border: descriptionError ? "1px solid red" : "1px solid black",
                  }}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <br />
                {categoryError && (
                  <div
                    className="error"
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      marginTop: "5px",
                      color: "red",
                    }}
                  >
                    {categoryError}
                  </div>
                )}
                <select
                  className="addInputs"
                  value={category}
                  style={{
                    backgroundColor: categoryError
                      ? "rgba(255, 0, 0, 0.1)"
                      : "transparent",
                    border: categoryError ? "1px solid red" : "1px solid black", // Red transparent background if there's an error
                  }}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value=" ">Choose a Brand</option>
                  <option value="Luxury Brand">Luxury Brand</option>
                  <option value="Casual Brand">Casual Brand</option>
                </select>

                <br />
                <input
                  type="file"
                  className="file"
                  style={{ marginTop: "25px" }}
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
                      border: imageError ? "1px solid red" : "1px solid black",
                      marginTop: "20px",
                      marginLeft: "108px",
                      width: "90px",
                      height: "90px",
                      backgroundColor: imageError
                      ? "rgba(255, 0, 0, 0.1)"
                      : "transparent",
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
          <div className="popup-container">
            <div className="popup">
              <h2 className="label">Update Brand</h2>
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={inputs.name}
                  onChange={handleChangeUpdate}
                  name="name"
                  placeholder="Name"
                  style={{ marginTop: "20px", width: "100%" }}
                />
                <br />
                <input
                  type="text"
                  value={inputs.description}
                  onChange={handleChangeUpdate}
                  name="description"
                  placeholder="Description"
                  style={{ marginTop: "20px", width: "100%" }}
                />
                <br />
                <select
                  value={inputs.category}
                  onChange={handleChangeUpdate}
                  name="category"
                  style={{ marginTop: "20px", width: "100%" }}
                >
                  <option value="Luxury Brand">Luxury Brand</option>
                  <option value="Casual Brand">Casual Brand</option>
                </select>
                <br />
                <input
                  type="file"
                  name="image"
                  onChange={handleChangeUpdate}
                  style={{ marginTop: "20px" }}
                />
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
  );
}

export default Brands;
