import redis from '../config/redis.js';
import { Auction, Bid } from '../models/index.js';

export default function auctionSockets(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinAuction', (auctionId) => {
      socket.join(`auction_${auctionId}`);
    });

    socket.on('placeBid', async ({ auctionId, amount }) => {
      const auction = await Auction.findByPk(auctionId);
      const highestBid = parseFloat(await redis.get(`auction:${auctionId}:highestBid`)) || auction.startingPrice;

      if (amount >= highestBid + auction.bidIncrement) {
        await redis.set(`auction:${auctionId}:highestBid`, amount);
        await auction.update({ currentBid: amount });
        await Bid.create({ amount, auctionId });

        io.to(`auction_${auctionId}`).emit('bidUpdate', { currentBid: amount });
        socket.emit('bidPlaced', amount);
        socket.broadcast.to(`auction_${auctionId}`).emit('outbid');
      } else {
        socket.emit('bidError', 'Bid too low');
      }
    });
  });
}
