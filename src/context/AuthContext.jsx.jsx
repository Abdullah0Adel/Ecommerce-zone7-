// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [isGuest, setIsGuest] = useState(false); // NEW STATE for guest login

//   // Check if user is logged in on page load
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await axios.get('http://localhost:1337/api/users/me', {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           setUser(response.data);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error('Error verifying authentication:', error);
//           localStorage.removeItem('token');
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//       }
//       setLoading(false);
//     };

//     checkAuthStatus();
//   }, []);

//   // Login function
//   const login = async (identifier, password) => {
//     try {
//       const response = await axios.post('http://localhost:1337/api/auth/local', {
//         identifier,
//         password
//       });
      
//       const { jwt, user } = response.data;
//       localStorage.setItem('token', jwt);
//       setUser(user);
//       setIsAuthenticated(true);
//       setIsGuest(false); // Not a guest
//       return { success: true };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { 
//         success: false, 
//         message: error.response?.data?.error?.message || 'Login failed. Please check your credentials.'
//       };
//     }
//   };

//   // Register function
//   const register = async (username, email, password) => {
//     try {
//       const response = await axios.post('http://localhost:1337/api/auth/local/register', {
//         username,
//         email,
//         password
//       });
      
//       const { jwt, user } = response.data;
//       localStorage.setItem('token', jwt);
//       setUser(user);
//       setIsAuthenticated(true);
//       setIsGuest(false);
//       return { success: true };
//     } catch (error) {
//       console.error('Registration error:', error);
//       return { 
//         success: false, 
//         message: error.response?.data?.error?.message || 'Registration failed. Please try again.'
//       };
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setIsAuthenticated(false);
//     setIsGuest(false);
//   };

//   // ➡️ Guest login function
//   const guestLogin = () => {
//     setUser({ username: 'Guest User' });
//     setIsAuthenticated(true);
//     setIsGuest(true);
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     isGuest,  // Pass guest info
//     loading,
//     login,
//     register,
//     logout,
//     guestLogin  // Pass guest login function
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
