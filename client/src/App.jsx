import React, { useState, useEffect } from 'react';
import AuctionForm from './components/AuctionForm';
import AuctionList from './components/AuctionList';
import AuctionRoom from './components/AuctionRoom';
import SellerDecision from './components/SellerDecision';
import axios from 'axios';
import socket from './utils/socket';
import { motion } from 'framer-motion';

export default function App() {
  const [auctionId, setAuctionId] = useState(null);
  const [auctionData, setAuctionData] = useState(null);
  const [user] = useState({ id: 1, name: "Test Seller", email: "seller@example.com" }); 

  useEffect(() => {
    if (auctionId) {
      axios.get(`/api/auctions/${auctionId}`).then(res => setAuctionData(res.data));
      socket.emit('joinAuction', auctionId);
      socket.on('auctionEnded', () => {
        axios.get(`/api/auctions/${auctionId}`).then(res => setAuctionData(res.data));
      });
      return () => socket.off('auctionEnded');
    }
  }, [auctionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-6">
      <motion.h1 
        className="text-4xl font-bold text-center mb-6 text-purple-200 drop-shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚡ Mini Auction System ⚡
      </motion.h1>

      {!auctionId && (
        <motion.div 
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-purple-500/20"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <AuctionForm onAuctionCreated={() => {}} />
          </motion.div>
          <motion.div 
            className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-purple-500/20"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <AuctionList onJoin={(id) => setAuctionId(id)} />
          </motion.div>
        </motion.div>
      )}

      {auctionId && auctionData && (
        <motion.div 
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-purple-500/20"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <AuctionRoom auctionId={auctionId} />
          </motion.div>

          {auctionData.status === 'ended' && auctionData.userId === user.id && (
            <motion.div 
              className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-xl border border-purple-500/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <SellerDecision auctionId={auctionId} highestBid={auctionData.currentBid} />
            </motion.div>
          )}

          <div className="flex justify-center pt-4">
            <button
              onClick={() => setAuctionId(null)}
              className="bg-gradient-to-r from-purple-700 to-black text-white px-6 py-2 rounded-full shadow-lg hover:from-purple-800 hover:to-gray-900 transition-all duration-300"
            >
              ← Back to Auctions
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
