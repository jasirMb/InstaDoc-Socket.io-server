const app = require("express")();
const http = require("http").createServer(app);
const cors = require("cors");
const express = require("express");

app.use(cors());
let activeUsers = [];
console.log("bbbbbbbbbbbb");
// console.log(activeUsers);
// console.log("aaaaaaaaaaaa");
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("Hello, World!");
});
const io = require("socket.io")(4000, { cors: { origin: "*" } });
// io.on("connection", (socket) => {
// //   console.log("user connected to slocket");
// });
io.on("connection", (socket) => {
  // add new user
  socket.on("new-user-add", (newUserId) => {
    
    // if user not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
        console.log("new user added");
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log(activeUsers);
    // io.emit("get-users", activeUsers);
  });
  //send message
  socket.on("send-message", (data) => {
    const receiverId = data.receiverId;
    console.log(data);
    // console.log(receiverId+"rev=civer");
    const user = activeUsers.find((user) => user.userId == receiverId);
    // console.log(user+"its doctor");
    if (user) {
      console.log("reciver also online");
      io.to(user.socketId).emit("receive-message", data);
    }else{
        console.log("disconnected");
        io.emit("disconnected");
    }
  });
  socket.on("notifyDoc", (data) => {
    console.log(data);
    const userId = data.userId
    const receiverId = data.id
    
    const doctor = activeUsers.find((doctor) => doctor.userId == receiverId);
    console.log("jjjjjjjjjjj");
    // console.log(doctor);
    if (doctor) {
      io.to(doctor.socketId).emit("chatReq",userId);
    } 
  });
  socket.on("accepted", (connection) => {
    console.log("jjjjjjjjjj");
    // console.log(connection);
    let userId = connection.userId
    let docId = connection.docID
    const user = activeUsers.find((user) => user.userId == userId);
    // console.log(user);
    if(user){
        io.to(user.socketId).emit('doctorAccepted', docId)
    }
    
  })
  socket.on("rejected", (connection) => {
    console.log("jjjjjjjjjj");
    // console.log(connection);
    let userId = connection.userId
    let docId = connection.docID
    const user = activeUsers.find((user) => user.userId == userId);
    // console.log(user);
    if(user){
        io.to(user.socketId).emit('doctorRejected', docId)
    }
    
  })
//   socket.on("disconnect", () => {
//     activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
//     io.emit("get-users", activeUsers);
//   });
});
// http.listen(4000,() => {
//     console.log("socket running on 4000 port");
// })
