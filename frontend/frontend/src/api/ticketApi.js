import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tickets
export const getTickets = async () => {
  const response = await API.get("/tickets/tickets/");
  console.log("BACKEND TICKETS:", response.data);
  return response.data;
};

// Clients, Departments, Facilities, Users
export const getMetaData = async () => {
  const response = await API.get("/tickets/meta/");
  console.log("BACKEND META:", response.data);
  return response.data;
};

export default API;