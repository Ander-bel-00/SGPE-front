import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Esta línea es crucial para enviar cookies con las solicitudes.
});

// Configurar Axios para incluir el token en los encabezados.
clienteAxios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default clienteAxios;
