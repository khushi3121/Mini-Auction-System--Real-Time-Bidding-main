import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default function AuctionList({ onJoin }) {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0); // triggers re-render every second

  // Fetch all auctions from backend
  const fetchAuctions = async () => {
    try {
      const res = await axios.get('/api/auctions');
      setAuctions(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load auctions', err);
      toast.error('Failed to load auctions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();

    // Real-time bid updates
    socket.on('bidUpdate', ({ auctionId, currentBid }) => {
      setAuctions(prev =>
        prev.map(a => (a.id === auctionId ? { ...a, currentBid } : a))
      );
      toast.info(`New bid on auction ${auctionId}: ₹${currentBid}`);
    });

    // Set interval to re-render every second
    const interval = setInterval(() => setTick(t => t + 1), 1000);

    return () => {
      socket.off('bidUpdate');
      clearInterval(interval);
    };
  }, []);

  // Function to calculate remaining time
  const getRemainingTime = (endTime) => {
    const now = dayjs();
    const end = dayjs(endTime);
    const diff = end.diff(now);
    if (diff <= 0) return 'Auction Ended';
    const dur = dayjs.duration(diff);
    return `${dur.hours()}h ${dur.minutes()}m ${dur.seconds()}s`;
  };

  if (loading) return <p className="text-center text-white">Loading auctions...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Active Auctions</h2>
      <ul className="space-y-3">
        {auctions.map(a => (
          <li
            key={a.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-800 rounded shadow-md text-white"
          >
            <div className="flex flex-col space-y-1">
              <span className="font-semibold">{a.name}</span>
              <span className="text-gray-300">{a.description}</span>
              <span>Current Bid: ₹{a.currentBid}</span>
              <span>
                Status:{' '}
                {dayjs(a.endTime).isBefore(dayjs())
                  ? 'Ended'
                  : 'Live'}
              </span>
              {dayjs(a.endTime).isAfter(dayjs()) && (
                <span>Time Left: {getRemainingTime(a.endTime)}</span>
              )}
            </div>
            <button
              onClick={() => onJoin(a.id)}
              disabled={dayjs(a.endTime).isBefore(dayjs())}
              className={`mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${
                dayjs(a.endTime).isBefore(dayjs()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
