// src/utils/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_BASE_URL, API_USER, API_PASS, API_USER_VALUE, API_PASS_VALUE } from '@env';


const baseURL = API_BASE_URL;

const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const fetchData = async (endpoint) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    Alert.alert('Gagal', `Gagal mengambil data ${endpoint}!`);
    return null;
  }
};

export const addData = async (endpoint, data) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${baseURL}/${endpoint}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.msg || `Gagal menambah data ${endpoint}`;
    Alert.alert('Error', errorMsg);
    return null;
  }
};

export const editData = async (endpoint, id, data) => {
  try {
    const token = await getToken();
    const response = await axios.put(`${baseURL}/${endpoint}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.msg || `Gagal memperbarui data ${endpoint}`;
    Alert.alert('Error', errorMsg);
    return null;
  }
};

export const deleteData = async (endpoint, id) => {
  try {
    const token = await getToken();
    const response = await axios.delete(`${baseURL}/${endpoint}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.msg || `Gagal menghapus data ${endpoint}`;
    Alert.alert('Error', errorMsg);
    return null;
  }
};

export const fetchDataSafe = async (endpoint) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = response.data;
    if (!result || Object.keys(result).length === 0) return null; // tambah ini
    return result;
  } catch (error) {
    return null;
  }
};
