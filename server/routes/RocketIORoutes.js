/**
 * Copyright 2016-present, Bkav, Corp.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author monglv@bkav.com on 07/08/2022
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
import { Server } from 'socket.io';

let activeUsers = [];

const initRocketRoutes = (server) => {
    const socketIo = new Server(server, {
        cors: {
            origin: "*",
        }
    });
    socketIo.on("connection", (socket) => {
        socket.on("new-user-add", (newUserId) => {
            // if user is not added previously
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({ userId: newUserId, socketId: socket.id });
                console.log("New User Connected", activeUsers);
            }
            // send all active users to new user
            socketIo.emit("get-users", activeUsers);
        });

        socket.on("disconnect", () => {
            // remove user from active users
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            console.log("User Disconnected", activeUsers);
            // send all active users to all users
            socketIo.emit("get-users", activeUsers);
        });

        // send message to a specific user
        socket.on("send-message", (data) => {
            const { receiverId } = data;
            const user = activeUsers.find((user) => user.userId === receiverId);
            console.log("Sending from socket to :", receiverId)
            console.log("Data: ", data)
            if (user) {
                socketIo.to(user.socketId).emit("recieve-message", data);
            }
        });
    });
    return server;
};

export default initRocketRoutes;
