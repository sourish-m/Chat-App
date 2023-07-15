import API from "./axiosBase";

export const createChat = (senderId, receiverId) => API.post('/chat/', {
    "senderId": senderId,
    "receiverId": receiverId,
});

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);
