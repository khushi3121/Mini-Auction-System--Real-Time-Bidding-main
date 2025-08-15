import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function AuctionForm({ onAuctionCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    startingPrice: '',
    bidIncrement: '',
    startTime: '',
    duration: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post('/api/auctions', form);
    onAuctionCreated(res.data);
    setForm({
      name: '',
      description: '',
      startingPrice: '',
      bidIncrement: '',
      startTime: '',
      duration: ''
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/40 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-purple-200 text-center mb-4">Create New Auction</h2>

      <input
        className="border border-purple-500/50 bg-black/50 text-purple-100 placeholder-purple-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        name="name"
        placeholder="Item Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <textarea
        className="border border-purple-500/50 bg-black/50 text-purple-100 placeholder-purple-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border border-purple-500/50 bg-black/50 text-purple-100 placeholder-purple-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        name="startingPrice"
        placeholder="Starting Price"
        value={form.startingPrice}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border border-purple-500/50 bg-black/50 text-purple-100 placeholder-purple-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        name="bidIncrement"
        placeholder="Bid Increment"
        value={form.bidIncrement}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        className="border border-purple-500/50 bg-black/50 text-purple-100 placeholder-purple-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        name="startTime"
        value={form.startTime}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        className="border border-purple-500/50 bg-black/50 text-purple-100 placeholder-purple-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        name="duration"
        placeholder="Duration (minutes)"
        value={form.duration}
        onChange={handleChange}
        required
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full bg-gradient-to-r from-purple-700 via-purple-800 to-black text-white py-3 rounded-full shadow-lg hover:from-purple-800 hover:via-black hover:to-purple-900 transition-all duration-300 text-lg font-semibold"
      >
         Create Auction
      </motion.button>
    </motion.form>
  );
}
