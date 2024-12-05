import React, { useState, useEffect } from "react";
import "./IconUser.css";
import { FaUser } from "react-icons/fa";
import { useUser } from "./UserContext";
import {
  Box,
  Flex,
  Input,
  Button,
  List,
  ListItem,
  Text,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { Typography, Stack, Paper, Card, IconButton } from "@mui/material";
import heartIcon from "@iconify-icons/mdi/heart";
import { FaChartLine, FaChartBar, CheckCircleIcon } from "react-icons/fa";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import AreaChart from "./AreaChart";
import TodoForm from "./TodoForm";
import "./Dashboards.css";
// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard({ isSidebarOpen, sidebarWidth = 180 }) {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(null);
  const dataRevenue = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ], // X-axis labels
    datasets: [
      {
        label: "Sales in US $",
        data: [
          8222, 30025, 70258, 32014, 102577, 73624, 21362, 66325, 96314, 36285,
          23568, 75315,
        ], // Data points
        backgroundColor: "red", // Bar color
        borderColor: "#950606", // Border color
        borderWidth: 1,
      },
    ],
  };

  const optionsRevenue = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue and Profits per Year", // Chart title
      },
    },
  };
  const dataOrders = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ], // X-axis labels
    datasets: [
      {
        label: "Orders",
        data: [
          6500, 5956, 8000, 8120, 5635, 4452, 6589, 7785, 3657, 7621, 5896,
          4236,
        ], // Data points
        backgroundColor: [
          "#6d8196",
          "#dab1da",
          "#dea193",
          "#58855c",
          "#a2574f",
          "red",
          "#d6b588",
          "#c6c0b9",
          "#a745d6",
          "#FD3D55",
          "#8ddcdc",
          "#e0edbb",
        ],
        borderColor: [
          "#6d8196",
          "#dab1da",
          "#dea193",
          "#58855c",
          "#a2574f",
          "#d9d9d9",
          "#d6b588",
          "#c6c0b9",
          "#a745d6",
          "#FD3D55",
          "#8ddcdc",
          "#e0edbb",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsOrders = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of orders per Year", // Chart title
      },
    },
  };
  const dataAmount = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ], // X-axis labels
    datasets: [
      {
        label: "",
        data: [
          6500, 5956, 8000, 8120, 5635, 4452, 6589, 7785, 3657, 7621, 5896,
          4236,
        ], // Data points
        backgroundColor: [
          "#6d8196",
          "#dab1da",
          "#dea193",
          "#58855c",
          "#a2574f",
          "#d9d9d9",
          "#d6b588",
          "#c6c0b9",
          "#a745d6",
          "#FD3D55",
          "#8ddcdc",
          "#e0edbb",
        ],
        borderColor: [
          "#dab1da",
          "#d3d3d3",
          "#dea193",
          "#58855c",
          "#a2574f",
          "#d9d9d9",
          "#d6b588",
          "#c6c0b9",
          "#a745d6",
          "#FD3D55",
          "#8ddcdc",
          "#e0edbb",
        ],
        borderWidth: 2,
      },
    ],
  };

  const optionsAmount = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total Amount per Year", // Chart title
      },
    },
  };

  const dataUser = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ], // X-axis labels
    datasets: [
      {
        label: "Sales in US $",
        data: [
          6500, 5956, 8000, 8120, 5635, 4452, 6589, 7785, 3657, 7621, 5896,
          4236,
        ], // Data points
        backgroundColor: [
          "#6d8196",
          "#dab1da",
          "#dea193",
          "#58855c",
          "#a2574f",
          "#d9d9d9",
          "#d6b588",
          "#c6c0b9",
          "#a745d6",
          "#FD3D55",
          "#8ddcdc",
          "#e0edbb",
        ],
        borderColor: [
          "#6d8196",
          "#dab1da",
          "#dea193",
          "#58855c",
          "#a2574f",
          "#d9d9d9",
          "#d6b588",
          "#c6c0b9",
          "#a745d6",
          "#FD3D55",
          "#8ddcdc",
          "#e0edbb",
        ],
        borderWidth: 3,
      },
    ],
  };

  const optionsUser = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of users per Year", // Chart title
      },
    },
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([...todos, inputValue]);
      setInputValue("");
    }
  };

  const contentStyle = {
    marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "10px",
    transition: "margin-left 0.4s ease, width 0.4s ease",
    width: isSidebarOpen
      ? `calc(100% - ${sidebarWidth}px)`
      : `calc(100% - 20px)`,
  };

  useEffect(() => {
    // Retrieve user data from localStorage on component mount
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  return (
    <div
      className="layout-container"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "70px", // Adjust based on sidebar state
        transition: "margin 0.3s ease",
      }}
    >
      {/* First Row */}
      <div className="row" >
        {/* Column 1 */}
        <div className="column complex-column" style={{height:'600px',width: isSidebarOpen ? `400px` : "450px" }}>
          <div className="nested-row">
            <div className="cell" style={{marginLeft: isSidebarOpen ? `0px` : "15px",height:'100px',width:'180px'}}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAYAAAARfGZ1AAAABHNCSVQICAgIfAhkiAAAAW9JREFUSImVlcuVwyAMRS85s3UP7iSkhCQFERcUpwSTTtwD+2EWfAaDwVgbH4P0JD19EDRk/BiJRflf6b8ay3d9Dq+WLcClCvw2LyxLBjoBIFDj2xyCV4HH2dhxNsv4MbJ1fx7cGdqmzsfIcTa2lUFBS1QOFFRkvQ8a0Aiu3eDRuKNgWL6A3KNuH9xFog+BO6QE99GcAfEUdYBfXNRdrSZQNLIswJNCqRqXG+cu0z5wH9HkDZc8A9+CCwKFZWoVXtQuYnQijr8mrcUB8CF4dOA0r/47QVnEQGF6LgqFXxddV5+ntrOxeTY/EdSisMjgbnyb0w5yEd6r236C23ofdMK1Xh/DrRpt2k1ug+qUNhGBspQ2xdwpns+2uRUj+PoYiuJuAGoO0sgtUxhCAiWH6zXs78bU7t2HIdKFdiLrc3hhmRCoMw/EBZCtES4cwP4jkVMC8dXpjiaM/xFNkBT06OUpLeud9K9CsUPOi5+P/PgPRYzwrHyI030AAAAASUVORK5CYII="
                  alt=" Users per Day"
                  width="30"
                  height="30"
                />
                <Box>
                  <Typography variant="h4">500</Typography>
                  <Typography variant="body1">Users per Day</Typography>
                </Box>
              </Stack>
            </div>
            <div className="cell" style={{marginLeft: isSidebarOpen ? `-8px` : "10px",height:'100px',width:'180px'}}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAZCAYAAAA14t7uAAAABHNCSVQICAgIfAhkiAAAAYRJREFUSImtVUuygjAQ7I5un1ZpeRddCScDTwau4C5WrALXL/0WMYoUAfHZq3xmOpPJ9IR4A7fqkjiYJMzXh20+5cMpg7a+FoCS/rqE09gBZoy0qWzuSVlSLl3tt5RwAgASmd+fiaayeVtbxZzb+lq0tdWtuiSzIwbi+aR+T2N+UWKSx6lDAUBcZIP+YdB/eRIZwFLSOX74sM36sM0J+Hx6o++AcumyuyDhZOBKABBN4ashnsu+jU+LL80XYgNX/hx2JQC0tQUAhPkQ+ja36gLRJJ4Lz4caI5kDB5MsY5teCBoliNmQPBIA2toKYLnab9J/Bou2vhaSztGIP0UI7iGQsXqdwpCsTUzrc0hFU/R5JnvFu+iqFgBMf+FbMM+BV9y38FFVhIY11FLD3tKrTrNUJy4yQklTWaBz06ayuYiMn0a82m/Str4WpDJhcQSEbnekXMqgunfquNukgOGPlnLpz2FX3iNWQuLFYAhOBgAexCHyQB5IgfsPMkckQ2/RVDbv3+YP/1zf1/752ocAAAAASUVORK5CYII="
                  alt=" Sales per Day"
                  width="30"
                  height="30"
                />
                <Box>
                  <Typography variant="h4">12000$</Typography>
                  <Typography variant="body1">Sales per Day</Typography>
                </Box>
              </Stack>
            </div>
          </div>

          <div className="nested-row">
            <div className="cell" style={{ boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)", width: isSidebarOpen ? `380px` : "420px",marginTop:'-70px',height: '400px' }}>
            
                <Line
                  data={dataRevenue}
                  options={{
                    ...optionsRevenue,
                    maintainAspectRatio: false, // Set to false to allow custom height/width
                  }}
                  height={350} // Set custom height
                  width={400} // Set custom width
                />
             
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="column complex-column" style={{height:'600px',width: isSidebarOpen ? `590px` : "620px" ,marginLeft:'-20px'}}>
          <div className="nested-row1">
            <div className="cell" style={{height:'100px',width:'180px'}}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAYAAAAxFw7TAAAABHNCSVQICAgIfAhkiAAAAUdJREFUOI3llLFxg0AQRd8iFSB3YCJLmTsQKsGJNC7DFSAqcBkanLgEnzpQBtm1QAOwDgCDmAMOZx7/6Lhj3/y9213BodRmZ5DYddZJk1O4Ow93pV1cbBa16xXBu6LPAsaJgkiQW0n11u69hjsDIGNuBCmO4dODO4PcAo8u15LaXAVMiSY9h5+KbkCvLiDIXpCipHrpYiRWiNZ1CnptLTcOCmADsncDQdHiPiaLQGrgUKdwG46B5hT8NvAfAFObnVOba11m43I+igsGEguYo6M7FjmsO6iFbQ9z/08CLzaLAuTLFwYTKbcwqAu/f3cVmH5RewEDiLqvYa+rEzYJbEbTj6tuiGgy5q4xMq8+zDUDvRwOYT4lM+twacnMAmtp4guDmZSbyze+MPgL02YtYBSJP2w+Ou59pcC6RJMVgt51xnIJmAo9fAOqTIvxPPU0nAAAAABJRU5ErkJggg=="
                  alt="Orders per Day"
                  width="30"
                  height="30"
                />
                <Box>
                  <Typography variant="h4">5000</Typography>
                  <Typography variant="body1">Orders per Day</Typography>
                </Box>
              </Stack>
            </div>
            <div className="cell" style={{height:'100px',width:'180px'}}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAYAAACzdqxAAAAABHNCSVQICAgIfAhkiAAAATNJREFUSIm1lU2SgyAQhV/j3CtkNZUjaHGX6F1ScwVKN+rB6J7FDCk0IKjJ28nP1w3Yr4FC8VCPrm/a0vWUW+D6piXgHo4J0FXfP5tBkmCxRkvl7hDSfytlEqE5DLIV4AUcA5KrOro9pucJSC5+PgVfgNfH3soot5ZiWZbcYS4ALSZWxy6VWKNZsfYcATrivhEAIFbXvcCt7JUfPAJ1fdOKNdp/h9enYhtKJNZoAu6sWMfmD4O9iORyCsxDPfr3KFF5xr5gzoDFGs1DPe4BlYH/iyV88beA36F4xkLzWfBXNBqriRVDBUVDrK7hP0u3xyTWJKv1WdJ7jCclsUaL4hEAFiYkQKdYTUdMaO2OBOzz4bVS7vhZo89lIUKz35RrXZvgVEZhr8s1hY+1/2K5vmn3+McvKxnxJQi7zY4AAAAASUVORK5CYII="
                  alt=" Visitors per Day"
                  width="30"
                  height="30"
                />
                <Box>
                  <Typography variant="h4">5000</Typography>
                  <Typography variant="body1">Visitors per Day</Typography>
                </Box>
              </Stack>
            </div>
            <div className="cell" style={{height:'100px',width:'180px'}}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURXDaOKfrg6DpeIbkVHfdP3PZOaXqgEdwTHTgO3LbO6nrhoPhT5vocnHeN5jnbqLpe3HeN3HeN3LeN6nqh3HdN5HlihcAAAATdFJOUynwv0IzEOEAVB75c6S8jdD74PTaCzX4AAABo0lEQVRYw+2Z25aCMAxFe6P2ggUJ//+tgzK61AqmbbJmHjgvvu11SNLUJuL0q8570STvuztLrD+NwAf4CdoJMnV3KCFzpQpi5o26QAWxrlBPDfULVJDrJDp6aCc8PdTzQA8d+lu5y3Q5n6OhZJppXnV2hEbnh+iwT9B5jI0w7UwGXcxW82JvJQCEmEHHqY7q1BV4k82djjUR0AqelEMXbHG2+gDfoKVhNQPAd+hcZFVbQEFLrGoJOOiMP7Em87kJxReAAjQU/f0J6KFGFkAv2AKFAuiEzHzYhJqx1ulno7C2l3fqhKx+uwMVxr0KWaYa9qCVShxQxQEdOKAbecplC/q+xEIh4DtUQEPBMTgFTR9TCO3ZzyXb6/RD+ttPVK6+4G5Gpz8K+qBKio7yLlX03wRXqcEJequKoacEXQiNtPW0f/c1fDzmWNmal5TZD6vUVf3f7Hm1uvZa2Y6ranhFxs8hkKntTZbysxX65seuScNLz7K9FhQySQ1WBmkHlWiIhw79h7kk0/yUZXzMMujmGcmzLA941hwsCxme1RHPkot6HfcDFH1zDC6jkicAAAAASUVORK5CYII="
                  alt=" Revenue per Day"
                  width="30"
                  height="30"
                />
                <Box>
                  <Typography variant="h4">9000$</Typography>
                  <Typography variant="body1">Revenue per Day</Typography>
                </Box>
              </Stack>
            </div>
          </div>
          <div className="nested-row">
            <div className="cell" style={{ boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)", width: isSidebarOpen ? `560px` : "590px",marginTop:'-50px',height: '400px' }}>
              <Box
                className="bg-light rounded h-100 p-4"
                borderRadius="md"
                p={4}
                style={{
                  height: "355px",
                  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Bar
                  data={dataOrders}
                  options={optionsOrders}
                  // style={{ height: "400px" }}
                />
              </Box>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="column">
          <div className="single-cell">
            <TodoForm ></TodoForm>
          </div>
        </div>
      </div>



      {/* Second Row */}
      <div className="row">
         {/* <div className="column"> */}
          {/* <Doughnut data={dataAmount} options={optionsAmount} /> */}
        {/* </div>  */}
        <div className="column">
          <Doughnut data={dataUser} options={optionsUser} style={{width: isSidebarOpen ? `900px` : "900px",width:'480px',boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)"}}/>
        </div>
        <div className="column" style={{width: isSidebarOpen ? `870px` : "1000px" ,boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",height:'480px',marginTop:'10px'}}>
        <AreaChart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
