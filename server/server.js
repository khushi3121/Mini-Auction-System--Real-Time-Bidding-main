import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import auctionRoutes from './routes/auctionRoutes.js';
import sequelize from './config/db.js';
import Auction from './models/Auction.js';
import redis from './config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' }
});

app.use(cors());
app.use(express.json());
app.use('/api/auctions', auctionRoutes);

// Socket.io real-time bidding
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(`auction_${auctionId}`);
    console.log(`User ${socket.id} joined auction ${auctionId}`);
  });

  socket.on('placeBid', async ({ auctionId, amount }) => {
    try {
      const auction = await Auction.findByPk(auctionId);
      if (!auction) return;

      // Check bid against Redis for fastest access
      const highestBid = parseFloat(await redis.get(`auction_${auctionId}`)) || auction.currentBid;

      if (amount >= highestBid + auction.bidIncrement) {
        auction.currentBid = amount;
        await auction.save();
        await redis.set(`auction_${auctionId}`, amount); // update Redis

        io.to(`auction_${auctionId}`).emit('bidUpdate', { currentBid: amount });
      } else {
        socket.emit('bidRejected', { message: 'Bid too low' });
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Sync DB and start server
sequelize.sync().then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
});

// Export server for Vervel
export default server;
