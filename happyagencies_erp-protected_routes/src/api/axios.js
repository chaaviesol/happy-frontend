import axios from "axios";
import { prismaBaseApi } from "../config";
const BASE_URL = prismaBaseApi;

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
