import express from 'express';
import redis from '../config/redis.js';
import { Auction, Bid } from '../models/index.js';

const router = express.Router();

router.post('/:auctionId', async (req, res) => {
  const { amount } = req.body;
  const { auctionId } = req.params;

  const auction = await Auction.findByPk(auctionId);
  if (!auction) return res.status(404).json({ error: 'Auction not found' });

  const highestBid = parseFloat(await redis.get(`auction:${auctionId}:highestBid`)) || auction.startingPrice;

  if (amount >= highestBid + auction.bidIncrement) {
    await redis.set(`auction:${auctionId}:highestBid`, amount);
    await auction.update({ currentBid: amount });
    const bid = await Bid.create({ amount, auctionId });

    return res.json({ success: true, bid });
  } else {
    return res.status(400).json({ error: 'Bid too low' });
  }
});

export default router;
