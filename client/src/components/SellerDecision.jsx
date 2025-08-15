import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SellerDecision({ auctionId, highestBid }) {
  const [counterOffer, setCounterOffer] = useState('');
  const [open, setOpen] = useState(true); 

  const handleDecision = async (decision) => {
    try {
      if (decision === 'accept') {
        await axios.post(`/api/auctions/${auctionId}/accept`);
        toast.success('Bid accepted, confirmation sent.');
      }
      if (decision === 'reject') {
        await axios.post(`/api/auctions/${auctionId}/reject`);
        toast.info('Bid rejected.');
      }
      if (decision === 'counter') {
        await axios.post(`/api/auctions/${auctionId}/counter`, { amount: counterOffer });
        toast.info('Counter-offer sent to buyer.');
      }
      setOpen(false); 
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error processing decision');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Finalize Auction</h2>
        <p className="text-center text-gray-600 mb-4">
          Highest Bid: <span className="font-semibold text-green-600">₹{highestBid}</span>
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleDecision('accept')}
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
             Accept
          </button>
          <button
            onClick={() => handleDecision('reject')}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
             Reject
          </button>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Counter Offer"
              value={counterOffer}
              onChange={(e) => setCounterOffer(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              onClick={() => handleDecision('counter')}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ↔ Counter
            </button>
          </div>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
