import React, { useEffect, useState } from 'react';

import {
  Box, Table, Tbody, Tr, Td, VStack, FormControl, FormLabel, Input, Button,
  Heading, Spinner, Text, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Alert, AlertIcon,CloseButton 
} from '@chakra-ui/react';
import axios from 'axios';

function ContactUs() {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal controls
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(null);
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [address, setAddress] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure(); 
  const [currentContact, setCurrentContact] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      telephone,
      email,
      instagram,
      facebook,
      linkedin,
      youtube,
      address,
    };

    try {
      const response = await axios.post("http://localhost:8081/addContactUs", formData);
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
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:8081/getContactUs');
      setTableData(response.data); // Set the response data to tableData
      setLoading(false);
    } catch (err) {
      setError('Error fetching contact information');
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:8081/deleteContact_Us');
      console.log("Entries deleted successfully:", response.data);
      fetchData(); // Refresh the table after deletion
    } catch (err) {
      console.error('Error deleting entries:', err);
    }
  };
  const fetchCount = async () => {
    try {
      const response = await axios.post('http://localhost:8081/getCount');
      const count = response.data.total_count; // Ensure this matches the key in your server response
      setCount(count); // Set the total_count to the count state
      console.log(count);
    } catch (err) {
      console.error('Error fetching count:', err);
    }
  };
    const handleUpdateClick = (contact) => {
    // Set the current contact's data into state
    console.log(contact)
    setCurrentContact(contact);
    // Populate the form fields with the contact's data
    setTelephone(contact.telephone);
    setEmail(contact.email);
    setInstagram(contact.instagram);
    setFacebook(contact.facebook);
    setLinkedin(contact.linkedin);
    setYoutube(contact.youtube);
    setAddress(contact.address);
    // Open the update modal
    onUpdateOpen();
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const updatedContact = {
      telephone,
      email,
      instagram,
      facebook,
      linkedin,
      youtube,
      address,
    };

    try {
      const response = await axios.put(`http://localhost:8081/updatesContactUs/${currentContact.id}`, updatedContact);
      console.log("Contact updated successfully:", response.data);
      onUpdateClose(); // Close the modal after update
      fetchData(); // Refresh the table data after update
    } catch (error) {
      console.error("Error updating the contact:", error);
    }
  };

  const handleAddClick = () => {
    setAddress("");
    setEmail("");
    setFacebook("");
    setInstagram("");
    setLinkedin("");
    setTelephone("");
    setYoutube("");
    fetchCount();
    if (count >= 1) {
      setShowMessage(true);
    } else {
      onOpen();
    }
  };
  const handleClose = () => {
    setShowMessage(false); // Close the alert when the button is clicked
  };
  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      gap={8}
      p={5}
      bg="gray.50"
      minH="100vh"
      alignItems="center"
      justifyContent="center"
    >
      {/* First Content: Table with headers in rows */}
      <Box
        flex="1"
        border="1px solid #ccc"
        borderRadius="md"
        p={6}
        bg="white"
        boxShadow="md"
        maxW="600px"
        w="100%"
        mx="auto"
      >
        <Heading as="h3" size="lg" mb={6} textAlign="center" color="blue.600">
          Contact Information
        </Heading>
        <Button style={{ backgroundColor: 'rgb(226, 156, 137)', color: '#fff',width:"100px" }} onClick={handleAddClick}>
                        ADD
                      </Button>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          
          <Table variant="striped" colorScheme="blue" style={{height:"500px" , width:"660px",borderCollapse: "separate"}}>
            <Tbody>
              {tableData.map((contact, index) => (
                <React.Fragment key={index}>
                 <Tr  >
                    <Td fontWeight="bold"  color="blue.700" textAlign="center" fontSize="18px" >Telephone</Td>
                    <Td textAlign="left"  fontSize="16px">{contact.telephone}</Td>
                  </Tr>
               
                  <Tr borderBottom="1px solid #3182CE">
                    <Td fontWeight="bold"color="blue.700" textAlign="center" fontSize="18px">Email</Td>
                    <Td textAlign="left" fontSize="16px">{contact.email}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold" color="blue.700" textAlign="center" fontSize="18px">Instagram</Td>
                    <Td textAlign="left" fontSize="16px">{contact.instagram}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold" color="blue.700" textAlign="center" fontSize="18px">Facebook</Td>
                    <Td textAlign="left" fontSize="16px">{contact.facebook}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold" color="blue.700" textAlign="center" fontSize="18px">LinkedIn</Td>
                    <Td textAlign="left" fontSize="16px">{contact.linkedin}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold" color="blue.700" textAlign="center" fontSize="18px">YouTube</Td>
                    <Td textAlign="left" fontSize="16px">{contact.youtube}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold"  color="blue.700" textAlign="center" fontSize="18px">Address</Td>
                    <Td textAlign="left" fontSize="16px">{contact.address}</Td>
                  </Tr>
                  <Tr>
                  
                    <Td  textAlign="center">
                      {/* ADD button to open the modal */}
                      <Button style={{ backgroundColor: 'rgb(226, 156, 137)', color: '#fff',width:"30%" }} onClick={() => handleUpdateClick(contact)}>
                        Update
                    </Button>
                    </Td>
                    <Td textAlign="left">
                      <Button style={{ backgroundColor: 'rgb(226, 156, 137)', color: '#fff',width:"30%"}}  onClick={handleDelete}>
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
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
        <ModalContent style={{marginTop:"120px",width:"28%", marginLeft:"600px"}} bg="white">
          <ModalHeader style={{marginBottom:"30px" , fontSize:"20px" , marginLeft:"180px"}}>Add Contact</ModalHeader>
         
          <ModalBody>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Telephone</FormLabel>
                <Input
                  name="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Telephone Number ..."
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email ..."
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Instagram</FormLabel>
                <Input
                  name="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram ..."
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Facebook</FormLabel>
                <Input
                  name="facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Facebook ..."
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>LinkedIn</FormLabel>
                <Input
                  name="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn ..."
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>YouTube</FormLabel>
                <Input
                  name="youtube"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="YouTube ..."
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address ..."
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <Button
                style={{ backgroundColor: 'rgb(226, 156, 137)', color: '#fff' ,marginTop:"30px",marginBottom:"45px"}}
                type="submit"
                width="full"
                _hover={{ bg: "blue.600" }}
              >
                Submit
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose} closeOnOverlayClick={true} >
      <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent style={{marginTop:"120px",width:"28%",height:"30%", marginLeft:"600px"}} bg="white">
          <ModalHeader style={{marginBottom:"30px" , fontSize:"20px" , marginLeft:"180px"}}>Update Contact</ModalHeader>
         
          <ModalBody>
            <VStack spacing={4} as="form" onSubmit={handleUpdateSubmit}>
              <FormControl>
                <FormLabel>Telephone</FormLabel>
                <Input
                  name="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Enter your telephone number"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Instagram</FormLabel>
                <Input
                  name="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Enter your Instagram handle"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Facebook</FormLabel>
                <Input
                  name="facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Enter your Facebook handle"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>LinkedIn</FormLabel>
                <Input
                  name="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="Enter your LinkedIn handle"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>YouTube</FormLabel>
                <Input
                  name="youtube"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="Enter your YouTube handle"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
               
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  focusBorderColor="blue.500"
                />
              </FormControl>
           
              <Button
              
              style={{ backgroundColor: 'rgb(226, 156, 137)', color: '#fff',marginTop:"30px",marginBottom:"45px" }}
                type="submit"
                width="full"
                _hover={{ bg: "blue.600" }}
              >
                Update
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Message Box */}
      {showMessage && (
    <Box
    position="absolute"
  
   marginBottom="40%"
    width="20%"
    height="8%"
    bg="rgba(0, 0, 0, 0.5)"  // Transparent black background
    borderRadius="md"        // Rounded corners
    p={4}                     // Padding for the box
  >
    <Alert 
      status="info" 
      variant="subtle" 
      bg="rgba(255, 255, 255, 0.8)"  // White background with transparency for the alert
      borderRadius="md"               // Rounded corners for the alert
      boxShadow="lg"                  // Shadow for depth
      p={4}                           // Padding inside the alert
    >
      <AlertIcon boxSize="50px" />
      Cannot add, you need to update or delete.
      <CloseButton position="absolute" right="8px" top="8px" onClick={handleClose} />
    </Alert>
  </Box>
      )}
    </Box>
  );
}

export default ContactUs;
