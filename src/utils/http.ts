import axios from "axios";
import { ElMessage } from "element-plus";

import { mockAll } from "./mock";
import { useLoadingStore } from "@/stores/loading";
mockAll();

export const httpInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  withCredentials: true,
});

httpInstance.interceptors.request.use((config) => {
  const loadingStore = useLoadingStore();
  loadingStore.updateLoading(config, true);
  return config;
});

// Add a response interceptor
httpInstance.interceptors.response.use(
  function (response) {
    const loadingStore = useLoadingStore();
    loadingStore.updateLoading(response.config, false);
    return response.data;
  },
  function (error) {
    ElMessage({
      type: "warning",
      message: "请求失败",
    });
    return Promise.reject(error);
  }
);

declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
  export interface AxiosRequestConfig {
    loading?: boolean;
  }
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): AxiosResponse<T>;
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosResponse<T>;
  }
  export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance;
  }
}
