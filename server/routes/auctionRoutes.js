import express from 'express';
import { Auction } from '../models/index.js';

const router = express.Router();

// Create auction
router.post('/', async (req, res) => {
  const auction = await Auction.create(req.body);
  res.json(auction);
});

// List all auctions
router.get('/', async (req, res) => {
  const auctions = await Auction.findAll();
  res.json(auctions);
});

// Get single auction
router.get('/:id', async (req, res) => {
  const auction = await Auction.findByPk(req.params.id);
  res.json(auction);
});

export default router;
