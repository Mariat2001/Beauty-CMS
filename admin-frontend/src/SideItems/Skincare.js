import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, upload, updateImage, getStorageRef } from "../Firebase";
import { getDownloadURL } from "firebase/storage";

function Skincare({ isSidebarOpen, sidebarWidth = 250 }) {

    const currentUser = useAuth();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [description, setDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [skincare, setSkinCare] = useState([]);
    const [brandName, setBrandName] = useState([]);
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
    const [brandError, setBrandError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [SkincareImages, setSkincareImages] = useState({});
    const itemsPerPage = 4;
  
    const filteredSkincare = skincare.filter((skincare) => {
      const regex = new RegExp(filter, "i"); // 'i' flag for case-insensitive
      return (
        regex.test(skincare.name) ||
        regex.test(skincare.brand) ||
        regex.test(skincare.description) ||
        regex.test(skincare.category) ||
        regex.test(skincare.type) ||
        regex.test(skincare.price)
      );
    });

    const getTypeOptions = () => {
      switch (category) {
        case "face":
          return (
            <>
           <option value="">Choose a type</option>
              <option value="BBcream">BB cream</option>
              <option value="cleansers & toners">Cleansers & Toners</option>
              <option value="facescrub">Face Scrub</option>
              <option value="facewash">Face Wash</option>
              <option value="facemask">Face Mask</option>
              <option value="night cream">Night Cream</option>
              <option value="serum">Serum</option>
              <option value="sunscreenface">Sunscreen Face</option>
              
            </>
          );
        case "eyes":
          return (
            <>
            <option value="">Choose a type</option>
              <option value="Eyecream">Eye Cream</option>
              <option value="Eye mask">Eye Mask</option>
            </>
          );
        case "body":
          return (
            <>
            <option value="">Choose a type</option>
              <option value="bodylotion">Body Lotion</option>
              <option value="bodymist ">Body Mist</option>
              <option value="bodyoil">Body Oil</option>
              <option value="deodorants">Deodorants</option>
              <option value="sunscreenbody">Sunscreen Body</option>
              <option value="tanningoil">Tanning Oil</option>
            </>
          );
    
        default:
          return <option value="">Select a type</option>;
      }
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSkincare = filteredSkincare.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const totalPages = Math.ceil(filteredSkincare.length / itemsPerPage);
  
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
      fetchfunction();
    }, []);
  
    const fetchfunction = async () => {
        fetchSkincare();
      fetchBrandname();
    };
    const fetchSkincare = async () => {
      try {
        const response = await axios.post("http://localhost:8081/getskincare");
        setSkinCare(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    useEffect(() => {
      // Fetch image URLs for all brands
      skincare.forEach((skinCare) => {
        console.log(skinCare.image);
        if (skinCare.image) {
          getDownloadURL(getStorageRef(skinCare.image))
            .then((url) => {
                setSkincareImages((prev) => ({ ...prev, [skinCare.id]: url }));
            })
            .catch((error) => console.error("Error fetching image URL:", error));
        }
      });
    }, [skincare]);
  
    const fetchBrandname = async () => {
      try {
        const response = await axios.post("http://localhost:8081/getbrandsname");
        setBrandName(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
  
    const togglePopup = () => {
      setName("");
      setBrand("");
      setDescription("");
      setCategory("");
      setPrice("");
      setType("");
      setPhoto(null);
      setPhotoURL(null);
      setShowPopup(!showPopup);
  
  
      setNameError("");
      setBrandError("");
      setDescriptionError("");
      setCategoryError("");
      setPriceError("");
      setTypeError("");
      setImageError("");
    };
  
    const toggleUpdatePopup = async (skincare) => {
      setId(skincare.id);
      setInputs({
        name: skincare.name,
        brand: skincare.brand,
        description: skincare.description,
        category: skincare.category,
        type: skincare.type,
        price: skincare.price,
        image: skincare.image,
      });
    
      setName(skincare.name);
      setBrand(skincare.brand);
      setDescription(skincare.description);
      setCategory(skincare.category);
      setType(skincare.type);
      setPrice(skincare.price);
    
      if (skincare.image) {
        try {
          const url = await getDownloadURL(getStorageRef(skincare.image));
          setPhotoURL(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      } else {
        setPhotoURL(null);
      }
    
      setShowUpdatePopup(true);
      setImageName(skincare.image ? skincare.image.split("/").pop() : "");
    
      setNameError("");
      setDescriptionError("");
      setCategoryError("");
      setBrandError("");
      setTypeError("");
      setPriceError("");
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
  
        const updatedSkincareData = {
          name: inputs.name,
          brand: inputs.brand,
          description: inputs.description,
          category: inputs.category,
          type: inputs.type,
          price: inputs.price,
          imageUrl: newImageUrl || inputs.image,
          // Use existing image if no new image
        };
  
        const response = await axios.put(
          `http://localhost:8081/updateskincare/${id}`,
          updatedSkincareData
        );
  
        if (response.status === 200) {
          alert("Brand updated successfully");
          fetchSkincare(); // Fetch the updated list of brands
          handleCloseUpdatePopup(); // Close the popup after update
        } else {
          alert("Error updating makeup");
        }
      } catch (error) {
        console.error("Error updating makeup:", error);
        alert(
          "Error updating makeup: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async (skincareId) => {
      try {
        const response = await axios.delete(
          `http://localhost:8081/deleteskincare/${skincareId}`
        );
        console.log(skincareId);
        if (response.status === 200) {
          alert("Brand deleted successfully");
          fetchSkincare(); // Fetch the updated list of brands
        } else {
          alert("Error deleting skincare");
        }
      } catch (error) {
        console.error("Error deleting skincare:", error);
        alert("Error deleting brand");
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      setNameError("");
      setDescriptionError("");
      setCategoryError("");
      setBrandError("");
      setTypeError("");
      setPriceError("");
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
      if (!brand) {
        setBrandError("Brand is required");
        isValid = false;
      }
      if (!type) {
        setTypeError("Type is required");
        isValid = false;
      }
      if (!price) {
        setPriceError("Price is required");
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
        brand,
        description,
        category,
        type,
        price,
        imageUrl,
      };
      try {
        const response = await axios.post(
          "http://localhost:8081/addskincare",
          formData
        );
        togglePopup();
        fetchSkincare();
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
        type: "",
        brand: "",
        price: "",
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
            placeholder="Search Skincare..."
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
                <th className="header">Brand</th>
                <th className="header">Description</th>
                <th className="header">Category</th>
                <th className="header">Type</th>
                <th className="header">Price</th>
                <th className="header">Image</th>
                <th className="header">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentSkincare.map((skincare, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {skincare.name}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {skincare.brand}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {skincare.description}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {skincare.category}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {skincare.type}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {skincare.price}
                  </td>

                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    {SkincareImages[skincare.id] ? (
                      <img
                        src={SkincareImages[skincare.id]}
                        alt={skincare.name}
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
                      onClick={() => handleDelete(skincare.id)}
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
                      onClick={() => toggleUpdatePopup(skincare)}
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
          <div className="popup-container" style={{ width: "25%" }}>
            <div className="popup">
              <h2 className="label">Add SkinCare</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
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
                    className="addInputs1"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      backgroundColor: nameError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: nameError ? "1px solid red" : "1px solid black", // Red transparent background if there's an error
                    }}
                  />

                  <br />
                  {brandError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                        marginLeft: "185px",
                      }}
                    >
                      {brandError}
                    </div>
                  )}
                  <select
                    className="addInputs1"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{
                      marginRight: "-30px",
                      backgroundColor: brandError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: brandError ? "1px solid red" : "1px solid black",
                    }}
                  >
                    <option value="">Select a brand</option>
                    {brandName.map((brandItem, index) => (
                      <option key={index} value={brandItem.name}>
                        {brandItem.name}
                      </option>
                    ))}
                  </select>

                  <br />
                </div>

                <div className="input-group">
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
                    className="addInputs1"
                    placeholder="Description"
                    value={description}
                    style={{
                      backgroundColor: descriptionError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: descriptionError
                        ? "1px solid red"
                        : "1px solid black", // Red transparent background if there's an error
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
                        marginLeft: "185px",
                      }}
                    >
                      {categoryError}
                    </div>
                  )}
                  <select
                    className="addInputs1"
                    value={category}
                    style={{
                      width: "100%",
                      marginRight: "-30px",
                      backgroundColor: nameError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: nameError ? "1px solid red" : "1px solid black", // Red transparent background if there's an error
                    }}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="face">Face</option>
                    <option value="eyes">Eyes</option>
                    <option value="body">Body</option>
                  </select>

                  <br />
                </div>
                <div className="input-group">
                  {typeError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                      }}
                    >
                      {typeError}
                    </div>
                  )}
                  <select
                    className="addInputs1"
                    value={type}
                    style={{
                      marginLeft: "-2px",
                      marginRight: "-55px",
                      backgroundColor: nameError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: nameError ? "1px solid red" : "1px solid black",
                    }}
                    onChange={(e) => setType(e.target.value)}
                    disabled={!category} // Disable the type dropdown until a category is selected
                  >
                    {getTypeOptions()}
                  </select>

                  {priceError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                        marginLeft: "185px",
                      }}
                    >
                      {priceError}
                    </div>
                  )}
                  <br />
                  <input
                    type="number"
                    className="addInputs1"
                    value={price}
                    style={{
                      marginLeft: "54px",
                      marginRight: "-32px",
                      backgroundColor: nameError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: nameError ? "1px solid red" : "1px solid black", // Red transparent background if there's an error
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault(); // Prevent arrow keys from changing the value
                      }
                    }}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const parsedValue = parseInt(inputValue, 10);

                      if (!isNaN(parsedValue) && parsedValue > 0) {
                        setPrice(parsedValue); // Update the price state
                      } else if (inputValue === "") {
                        setPrice(""); // Clear the price state if the input is empty
                      }
                    }}
                    name="price"
                    placeholder="Price"
                  />

                  <br />
                </div>
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
          <div className="popup-container">
            <div className="popup">
              <h2 className="label">Update SkinCare</h2>
              <form onSubmit={handleUpdate}>
                <div className="input-group">
                  {nameError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                        marginLeft: "185px",
                      }}
                    >
                      {nameError}
                    </div>
                  )}
                  <input
                    type="text"
                    value={inputs.name}
                    onChange={handleChangeUpdate}
                    name="name"
                    placeholder="Name"
                    style={{
                      marginTop: "20px",
                      marginLeft: "-10px",
                      marginRight: "-4px",
                      backgroundColor: nameError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: nameError ? "1px solid red" : "1px solid black",
                    }}
                  />
                  <br />
                  {brandError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                        marginLeft: "185px",
                      }}
                    >
                      {brandError}
                    </div>
                  )}
                  <select
                    className="addInputs1"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{
                      marginRight: "-19px",
                      backgroundColor: brandError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: brandError ? "1px solid red" : "1px solid black",
                    }}
                  >
                    <option value="">Select a brand</option>
                    {brandName.map((brandItem, index) => (
                      <option key={index} value={brandItem.name}>
                        {brandItem.name}
                      </option>
                    ))}
                  </select>

                  <br />
                </div>
                <div className="input-group">
                  {descriptionError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                        marginLeft: "185px",
                      }}
                    >
                      {descriptionError}
                    </div>
                  )}
                  <input
                    type="text"
                    value={inputs.description}
                    onChange={handleChangeUpdate}
                    name="description"
                    placeholder="Description"
                    style={{
                      marginTop: "20px",
                      marginLeft: "-8px",
                      marginRight: "-5px",
                      backgroundColor: descriptionError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: descriptionError
                        ? "1px solid red"
                        : "1px solid black",
                    }}
                  />
                  <br />

                  {categoryError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                        marginLeft: "185px",
                      }}
                    >
                      {categoryError}
                    </div>
                  )}

                  <select
                    className="addInputs1"
                    value={category}
                    style={{
                      width: "123%",
                      marginRight: "-21px",
                      backgroundColor: categoryError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: categoryError
                        ? "1px solid red"
                        : "1px solid black", // Red transparent background if there's an error
                    }}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="face">Face</option>
                    <option value="eyes">Eyes</option>
                    <option value="body">Body</option>
                  </select>
                  <br />
                </div>

                <div className="input-group">
                  {typeError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                      }}
                    >
                      {typeError}
                    </div>
                  )}
                  <select
                    className="addInputs1"
                    value={type}
                    style={{
                      marginLeft: "-8px",
                      marginRight: "-44px",
                      backgroundColor: typeError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: typeError ? "1px solid red" : "1px solid black",
                    }}
                    onChange={(e) => setType(e.target.value)}
                    disabled={!category} // Disable the type dropdown until a category is selected
                  >
                    {getTypeOptions()}
                  </select>

                  {priceError && (
                    <div
                      className="error"
                      style={{
                        fontSize: "12px",
                        position: "absolute",
                        color: "red",
                        marginLeft: "185px",
                      }}
                    >
                      {priceError}
                    </div>
                  )}
                  <br />
                  <input
                    type="number"
                    className="addInputs1"
                    value={price}
                    style={{
                      marginLeft: "37px",
                      marginRight: "-20px",
                      backgroundColor: priceError
                        ? "rgba(255, 0, 0, 0.1)"
                        : "transparent",
                      border: priceError ? "1px solid red" : "1px solid black", // Red transparent background if there's an error
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault(); // Prevent arrow keys from changing the value
                      }
                    }}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const parsedValue = parseInt(inputValue, 10);

                      if (!isNaN(parsedValue) && parsedValue > 0) {
                        setPrice(parsedValue); // Update the price state
                      } else if (inputValue === "") {
                        setPrice(""); // Clear the price state if the input is empty
                      }
                    }}
                    name="price"
                    placeholder="Price"
                  />

                  <br />
                </div>

                <input
                  type="file"
                  name="image"
                  onChange={handleChangeUpdate}
                  style={{ marginTop: "20px" }}
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

export default Skincare
