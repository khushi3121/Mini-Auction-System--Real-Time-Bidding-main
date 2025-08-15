import React, { useState, useEffect } from 'react';
import socket from '../utils/socket';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function AuctionRoom({ auctionId }) {
  const [auction, setAuction] = useState(null);
  const [bid, setBid] = useState('');

  const fetchAuction = async () => {
    const res = await axios.get(`/api/auctions/${auctionId}`);
    setAuction(res.data);
  };

  useEffect(() => {
    fetchAuction();
    socket.emit('joinAuction', auctionId);

    socket.on('bidUpdate', data => {
      setAuction(prev => ({ ...prev, currentBid: data.currentBid }));
      toast.info(`New bid placed: ₹${data.currentBid}`);
    });

    socket.on('outbid', () => {
      toast.warning('You have been outbid!');
    });

    socket.on('auctionEnded', fetchAuction);

    socket.on('counterOffer', ({ amount }) => {
      toast.info(`Seller sent a counter-offer: ₹${amount}`);
      fetchAuction();
    });

    const interval = setInterval(fetchAuction, 5000);

    return () => {
      socket.off('bidUpdate');
      socket.off('outbid');
      socket.off('auctionEnded');
      socket.off('counterOffer');
      clearInterval(interval);
    };
  }, [auctionId]);

  const placeBid = () => {
    const bidAmount = parseFloat(bid);

    if (bidAmount <= auction.currentBid) {
      toast.error(`Your bid must be higher than the current bid of ₹${auction.currentBid}`);
      return;
    }

    socket.emit('placeBid', { auctionId, amount: bidAmount });
    setBid('');
  };

  if (!auction) return <p className="text-center text-white">Loading...</p>;

  return (
    <motion.div 
      className="space-y-4 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold">{auction.name}</h2>
      <p className="text-gray-100">{auction.description}</p>
      <h3 className="text-xl font-semibold">Current Bid: ₹{auction.currentBid}</h3>

      <div className="flex space-x-2">
        <input
          type="number"
          value={bid}
          onChange={e => setBid(e.target.value)}
          placeholder="Enter bid"
          className="border rounded px-3 py-2 flex-1 text-black"
        />
        <button
          onClick={placeBid}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
        >
          Place Bid
        </button>
      </div>
    </motion.div>
  );
}
