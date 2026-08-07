import axios from "axios";

const API = axios.create({
  //baseURL: `${process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT}/api`,
  //baseURL: `${process.env.NEXT_PUBLIC_API_URL_PRODUCTION}/api`,
  baseURL: `${process.env.NEXT_PUBLIC_API_URL_CPANEL_HOST || "https://amigowebster.in/indolanka_v2"}/api`,
  withCredentials: true,
});

export default API;
