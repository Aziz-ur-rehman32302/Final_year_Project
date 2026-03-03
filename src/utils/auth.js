// simple authentication helpers using localStorage

export const loginUser = (user, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token'));
};

export const getToken = () => {
  return localStorage.getItem('token');
};
