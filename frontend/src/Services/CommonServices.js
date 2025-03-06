// import axios from 'axios';
// // 
// export const login = async (data, api) => {
//     // try {
//     //     const response = await axios.post(`${API_BASE_URL}/${api}`, data);
//     //     console.log(response);

//     //     if (response.data.status === 200) {
//     //         const { result } = response.data;
//     //         return { success: true, user:  response.data.data };
//     //     } else {
//     //         return { success: false, message: response.data.msg };
//     //     }
//     // } catch (error) {
//     //     if (error.response && error.response.data) {
//     //         return {
//     //             success: false,
//     //             message: error.response.data.msg || 'Login failed',
//     //         };
//     //     }
//     //     return {
//     //         success: false,
//     //         message: 'An unexpected error occurred',
//     //     };
//     // }
// };

// export const register = async (data, api) => {
//     // try {


//     //     const response = await axios.post(`${API_BASE_URL}/${api}`, data);
//     //     console.log(response);

//     //     if (response.data.status === 200) {
//     //         const { result } = response.data;
//     //         return { success: true, user: response.data.data };
//     //     } else {
//     //         return { success: false, message: response.data.msg };
//     //     }
//     // } catch (error) {
//     //     if (error.response && error.response.data) {
//     //         return {
//     //             success: false,
//     //             message: error.response.data.msg || 'Registration  failed',
//     //         };
//     //     }
//     //     return {
//     //         success: false,
//     //         message: 'An unexpected error occurred',
//     //     };
//     // }
// };

// export const registerWithFile = async (data, api) => {
//     // try {


//     //     const response = await axios.post(`${API_BASE_URL}/${api}`, data,{  headers: {
//     //         'Content-Type': 'multipart/form-data',
//     //       },});
//     //     console.log(response);

//     //     if (response.status === 200) {
//     //         const { result } = response.data;
//     //         return { success: true, user: response.data.data };
//     //     } else {
//     //         return { success: false, message: response.data.msg };
//     //     }
//     // } catch (error) {
//     //     if (error.response && error.response.data) {
//     //         return {
//     //             success: false,
//     //             message: error.response.data.msg || 'Registration  failed',
//     //         };
//     //     }
//     //     return {
//     //         success: false,
//     //         message: 'An unexpected error occurred',
//     //     };
//     // }
// };
// export const registerWithFileforCaste = async (data, api,id) => {
//     // try {


//     //     const response = await axios.post(`${API_BASE_URL}/${api}/${id}`, data,{  headers: {
//     //         'Content-Type': 'multipart/form-data',
//     //       },});
//     //     console.log(response);

//     //     if (response.status === 200) {
//     //         const { result } = response.data;
//     //         return { success: true, user: response.data.data };
//     //     } else {
//     //         return { success: false, message: response.data.msg };
//     //     }
//     // } catch (error) {
//     //     if (error.response && error.response.data) {
//     //         return {
//     //             success: false,
//     //             message: error.response.data.msg || 'Registration  failed',
//     //         };
//     //     }
//     //     return {
//     //         success: false,
//     //         message: 'An unexpected error occurred',
//     //     };
//     // }
// };
// export const forgotPassword = async (data, api) => {
//     // try {


//     //     const response = await axios.post(`${API_BASE_URL}/${api}`, data);
//     //     console.log(response);

//     //     if (response.status === 200) {
//     //         const { result } = response.data;
//     //         return { success: true, user:  response.data.data };
//     //     } else {
//     //         return { success: false, message: response.data.msg };
//     //     }
//     // } catch (error) {
//     //     if (error.response && error.response.data) {
//     //         return {
//     //             success: false,
//     //             message: error.response.data.msg || 'Mail Sending failed',
//     //         };
//     //     }
//     //     return {
//     //         success: false,
//     //         message: 'An unexpected error occurred',
//     //     };
//     // }
// };

// export const resetPassword = async (data, api,id) => {
//     // try {


//     //     const response = await axios.post(`${API_BASE_URL}/${api}/${id}`, data);
//     //     console.log(response);

//     //     if (response.status === 200) {
//     //         const { result } = response.data;
//     //         return { success: true, user:  response.data.data };
//     //     } else {
//     //         return { success: false, message: response.data.msg };
//     //     }
//     // } catch (error) {
//     //     if (error.response && error.response.data) {
//     //         return {
//     //             success: false,
//     //             message: error.response.data.msg || 'Reset Password failed',
//     //         };
//     //     }
//     //     return {
//     //         success: false,
//     //         message: 'An unexpected error occurred',
//     //     };
//     // }
// };

// export const ViewById = async (api,id) => {
// //     try {

// // console.log(`${API_BASE_URL}/${api}/${id}`);

// //         const response = await axios.post(`${API_BASE_URL}/${api}/${id}`);
// //         console.log(response);

// //         if (response.status === 200) {
// //             const { result } = response.data;
// //             return { success: true, user:  response.data.data };
// //         } else {
// //             return { success: false, message: response.data.msg };
// //         }
// //     } catch (error) {
// //         if (error.response && error.response.data) {
// //             return {
// //                 success: false,
// //                 message: error.response.data.msg || 'View User failed',
// //             };
// //         }
// //         return {
// //             success: false,
// //             message: 'An unexpected error occurred',
// //         };
// //     }
// };

// export const updateWithFile = async (data, api,id) => {
// //     try {
// // console.log(data);


// //         const response = await axios.post(`${API_BASE_URL}/${api}/${id}`, data,{  headers: {
// //             'Content-Type': 'multipart/form-data',
// //           },});
// //         console.log(response);

// //         if (response.status === 200) {
// //             const { result } = response.data;
// //             return { success: true, user: response.data.data };
// //         } else {
// //             return { success: false, message: response.data.msg };
// //         }
// //     } catch (error) {
// //         if (error.response && error.response.data) {
// //             return {
// //                 success: false,
// //                 message: error.response.data.msg || 'Updation  failed',
// //             };
// //         }
// //         return {
// //             success: false,
// //             message: 'An unexpected error occurred',
// //         };
// //     }
// };