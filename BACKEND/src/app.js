const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
// import express from "express";
// import http from 'http';
// import {Socket} from 'socket.io';
// import mongoose from "mongoose";

const APP = express();
const server = http.createServer(APP);
const SERVER_SOCKET = socketIo(server,{
    cors: {
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST']
      }
});

const corsConfig = {
    origin: process.env.CORS_ORIGIN||"http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

APP.use(cors(corsConfig));

mongoose.connect(process.env.MONGO_URI||"mongodb+srv://splintercell1020:N0WAY001_CAN_1T@cluster0.qmtnseo.mongodb.net/Socket-Test");

const DataSchema = new mongoose.Schema({
    message:String
});

const Data = mongoose.model('Data',DataSchema);

const changeStream = Data.watch();

changeStream.on('change',(change)=>{
    console.log(change);
    SERVER_SOCKET.emit('DataChange',change);
})

APP.use(express.json());

APP.post('/add-data', async (req, res) => {
  const newData = new Data(req.body);
  await newData.save();
  res.status(201).send(newData);
});

server.listen(5000, () => console.log('Server running on port 5000'));