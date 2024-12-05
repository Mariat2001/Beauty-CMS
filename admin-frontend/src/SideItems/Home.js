import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Flex,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  Table,
  Tbody,
  Tr,
  Td,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  CloseButton,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";

import "leaflet/dist/leaflet.css";
import Slideshow1 from "./Slideshow1";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function Home({ isSidebarOpen, sidebarWidth = 250 }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [locations, setLocations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(null);
  const [description, setDescription] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [inputLocation, setInputLocation] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [id, setId] = useState(null);
  const [currentDescription, setCurrentDescription] = useState(false);
  const [defaultCenter, setDefaultCenter] = useState({ lat: 0, lng: 0 });
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const handleClose = () => {
    setShowMessage(false); // Close the alert when the button is clicked
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      description,
    };
    try {
      const response = await axios.post(
        "http://localhost:8081/addDescription",
        formData
      );
      console.log("Form submitted successfully:", response.data);
      onClose(); // Close the modal after successful submission
      fetchData(); // Refresh the table data after form submission
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchCount();
    fetchLocation();
  }, []);
  const fetchCount = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/getCountDescription"
      );
      const count = response.data.total_count; // Ensure this matches the key in your server response
      setCount(count); // Set the total_count to the count state
      console.log(count);
    } catch (err) {
      console.error("Error fetching count:", err);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:8081/getDescription");
      console.log(response.data);
      setTableData(response.data); // Set the response data to tableData
      setLoading(false);
    } catch (err) {
      setError("Error fetching contact information");
      setLoading(false);
    }
  };

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const fetchLocation = async () => {
    try {
      const response = await axios.post("http://localhost:8081/getLocation");
      console.log(response.data);
      const { id, Name, latitude, longitude } = response.data[0];

      console.log("name:", Name);
      console.log("Longitude:", longitude);
      setDefaultCenter({
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      });
      setLocation(Name);
      setId(id);

      setLoading(false);
    } catch (err) {
      setError("Error fetching contact information");
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8081/deleteDescription"
      );
      console.log("Entries deleted successfully:", response.data);
      fetchData(); // Refresh the table after deletion
    } catch (err) {
      console.error("Error deleting entries:", err);
    }
  };
  const handleUpdateClick = (description) => {
    // Set the current contact's data into state
    console.log(description);
    setCurrentDescription(description);
    // Populate the form fields with the contact's data
    setDescription(description.description);

    // Open the update modal
    onUpdateOpen();
  };
  const handleAddClick = () => {
    setDescription("");

    if (count >= 1) {
      setShowMessage(true);
    } else {
      onOpen();
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updatedDescription = {
      description,
    };
    console.log(description);
    try {
      const response = await axios.put(
        `http://localhost:8081/updatesDescription/${currentDescription.id}`,
        updatedDescription
      );
      console.log("description updated successfully:", response.data);
      onUpdateClose(); // Close the modal after update
      fetchData(); // Refresh the table data after update
    } catch (error) {
      console.error("Error updating the description:", error);
    }
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();

    try {
      const updatedLocationData = {
        Name: inputLocation,
        latitude: latitude,
        longitude: longitude,
      };

      console.log(updatedLocationData);

      // Use POST request to match the backend
      const response = await axios.post(
        "http://localhost:8081/addUpdateLocation", // No ID needed in the URL
        updatedLocationData
      );

      if (response.status === 200 || response.status === 201) {
        alert("Location added or updated successfully");
        fetchLocation(); // Fetch the updated list of locations
      } else {
        alert("Error updating Location");
      }
    } catch (error) {
      console.error("Error updating Location:", error);
      alert(
        "Error updating Location: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <Box width="100%" p={4}>
      <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
        <TabList
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0px", // Space between the tabs
            marginTop: "0px",
            padding: "10px",
            backgroundColor: "#f0f0f0", // Light background color
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow for depth
          }}
        >
          <Tab
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "0px",
              transition: "background-color 0.3s ease",
            }}
            _selected={{ backgroundColor: "rgb(226, 156, 137)", color: "white" }}
          >
            Slideshows
          </Tab>
          <Tab
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "0px",
              transition: "background-color 0.3s ease",
            }}
            _selected={{ backgroundColor: "rgb(226, 156, 137)", color: "white" }}
          >
            Map
          </Tab>
          <Tab
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "0px",
              transition: "background-color 0.3s ease",
            }}
            _selected={{ backgroundColor: "rgb(226, 156, 137)", color: "white" }}
          >
            About Us
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Slideshow1 />
          </TabPanel>

          <TabPanel>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              gap={8}
              p={5}
              bg="gray.50"
              minH="100vh"
              alignItems="center"
              justifyContent="center"
              style={{marginTop:'-80px',marginLeft:'250px'}}
            >
              <Box
                flex="1"
                border="1px solid #ccc"
                borderRadius="md"
                p={6}
                bg="white"
                boxShadow="md"
                maxW="850px"
                w="100%"
                mx="auto"
                style={{ boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)'}}
              >
                <h1>{location}</h1>
                <LoadScript googleMapsApiKey="APIKey">
                  <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={18}
                    center={defaultCenter}
                  >
                    <Marker position={defaultCenter} />
                  </GoogleMap>
                </LoadScript>
              </Box>

              <Box
                style={{
                  marginLeft: "0px",
                  marginRight: "80px",
                  width: "18%",
                  height: "290px",
                  marginTop:'20px',
                   boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)'
                }}
                bg="white"
                p={6}
                borderRadius="md"
                border="1px solid #ccc"
                boxShadow="md"
              >
                <form onSubmit={handleSubmitLocation} style={{marginTop:'40px'}}>
                  <FormControl id="field1" mb={4}>
                    <FormLabel style={{ marginLeft: "50px" }}>
                      Location:{" "}
                    </FormLabel>
                    <Input
                      type="text"
                      style={{ marginLeft: "50px" }}
                      placeholder="Enter location here"
                      value={inputLocation}
                      onChange={(e) => setInputLocation(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl id="field2" mb={4}>
                    <FormLabel style={{ marginLeft: "50px" }}>
                      Latitude:{" "}
                    </FormLabel>
                    <Input
                      type="text"
                      style={{ marginLeft: "50px" }}
                      placeholder="Enter latitude here"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      required // Make it a required field
                    />
                  </FormControl>
                  <FormControl id="field2" mb={4}>
                    <FormLabel style={{ marginLeft: "50px" }}>
                      Longitude:{" "}
                    </FormLabel>
                    <Input
                      type="text"
                      style={{ marginLeft: "50px" }}
                      placeholder="Enter longitude here"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      required // Make it a required field
                    />
                  </FormControl>
                  <Button
                    style={{ marginLeft: "85px", marginTop: "20px",backgroundColor:'rgb(226, 156, 137)' ,color:'white'}}
                    colorScheme="blue"
                    type="submit"
                  >
                    Add/Update
                  </Button>
                </form>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              gap={8}
              p={5}
              bg="gray.50"
              minH="100vh"
              alignItems="center"
              justifyContent="center"
              style={{marginTop:'-50px',}}
            >
              {/* First Content: Table with headers in rows */}
              <Box
                flex="1"
                border="1px solid #ccc"
                borderRadius="md"
                p={6}
                bg="white"
                boxShadow="md"
                maxW="700px"
                w="100%"
                mx="auto"
                style={{boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)'}}
              >
                <Heading
                  as="h3"
                  size="lg"
                  mb={6}
                  textAlign="center"
                  color="blue.600"
                >
                  About Us
                </Heading>
                <Button
                  style={{
                    backgroundColor: "rgb(226, 156, 137)",
                    color: "#fff",
                    width: "100px",
                  }}
                  onClick={handleAddClick}
                >
                  ADD
                </Button>
                {loading ? (
                  <Spinner />
                ) : error ? (
                  <Text color="red.500">{error}</Text>
                ) : (
                  <Table
                    variant="striped"
                    colorScheme="blue"
                    style={{
                      height: "500px",
                      width: "660px",
                      borderCollapse: "separate",
                    }}
                  >
                    <Tbody>
                      {tableData.map((description, index) => (
                        <React.Fragment key={index}>
                          <Tr>
                            <Td
                              fontWeight="bold"
                              color="blue.700"
                              textAlign="center"
                              fontSize="18px"
                            >
                              About Us
                            </Td>
                            <Td textAlign="left" fontSize="16px">
                              {description.description}
                            </Td>
                          </Tr>

                          <Tr>
                            <Td textAlign="center">
                              {/* ADD button to open the modal */}
                              <Button
                                style={{
                                  backgroundColor: "rgb(226, 156, 137)",
                                  color: "#fff",
                                  width: "30%",
                                }}
                                onClick={() => handleUpdateClick(description)}
                              >
                                Update
                              </Button>
                            </Td>
                            <Td textAlign="left">
                              <Button
                                style={{
                                  backgroundColor: "rgb(226, 156, 137)",
                                  color: "#fff",
                                  width: "30%",
                                }}
                                onClick={handleDelete}
                              >
                                Delete
                              </Button>
                            </Td>
                          </Tr>
                        </React.Fragment>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>

              {/* Modal for Adding Contact */}
              <Modal
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={true}
              >
                <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
                <ModalContent
                  style={{
                    marginTop: "120px",
                    width: "28%",
                    marginLeft: "600px",
                  }}
                  bg="white"
                >
                  <ModalHeader
                    style={{
                      marginBottom: "30px",
                      fontSize: "20px",
                      marginLeft: "180px",
                    }}
                  >
                    Add Contact
                  </ModalHeader>

                  <ModalBody>
                    <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                      <FormControl>
                        <FormLabel>About Us</FormLabel>
                        <Textarea
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Description ..."
                          focusBorderColor="blue.500"
                          size="md"
                          resize="vertical"
                          height="150px"
                        />
                      </FormControl>

                      <Button
                        style={{
                          backgroundColor: "rgb(226, 156, 137)",
                          color: "#fff",
                          marginTop: "30px",
                          marginBottom: "45px",
                        }}
                        type="submit"
                        width="full"
                        _hover={{ bg: "blue.600" }}
                      >
                        Submit
                      </Button>
                    </VStack>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </ModalContent>
              </Modal>

              <Modal
                isOpen={isUpdateOpen}
                onClose={onUpdateClose}
                closeOnOverlayClick={true}
              >
                <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
                <ModalContent
                  style={{
                    marginTop: "120px",
                    width: "28%",
                    height: "30%",
                    marginLeft: "600px",
                  }}
                  bg="white"
                >
                  <ModalHeader
                    style={{
                      marginBottom: "30px",
                      fontSize: "20px",
                      marginLeft: "180px",
                    }}
                  >
                    Update Contact
                  </ModalHeader>

                  <ModalBody>
                    <VStack spacing={4} as="form" onSubmit={handleUpdateSubmit}>
                      <FormControl>
                        <FormLabel>About Us</FormLabel>

                        <Textarea
                          name="Description "
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter your Description"
                          focusBorderColor="blue.500"
                        />
                      </FormControl>

                      <Button
                        style={{
                          backgroundColor: "rgb(226, 156, 137)",
                          color: "#fff",
                          marginTop: "30px",
                          marginBottom: "45px",
                        }}
                        type="submit"
                        width="full"
                        _hover={{ bg: "blue.600" }}
                      >
                        Update
                      </Button>
                    </VStack>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </ModalContent>
              </Modal>

              {/* Message Box */}
              {showMessage && (
                <Box
                  position="absolute"
                  marginBottom="40%"
                  width="20%"
                  height="8%"
                  bg="rgba(0, 0, 0, 0.5)" // Transparent black background
                  borderRadius="md" // Rounded corners
                  p={4} // Padding for the box
                >
                  <Alert
                    status="info"
                    variant="subtle"
                    bg="rgba(255, 255, 255, 0.8)" // White background with transparency for the alert
                    borderRadius="md" // Rounded corners for the alert
                    boxShadow="lg" // Shadow for depth
                    p={4} // Padding inside the alert
                  >
                    <AlertIcon boxSize="50px" />
                    Cannot add, you need to update or delete.
                    <CloseButton
                      position="absolute"
                      right="8px"
                      top="8px"
                      onClick={handleClose}
                    />
                  </Alert>
                </Box>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Home;
