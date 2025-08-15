import sequelize from '../config/db.js';
import Auction from './Auction.js';
import Bid from './Bid.js';
import User from './User.js';

Auction.hasMany(Bid, { foreignKey: 'auctionId' });
Bid.belongsTo(Auction);

User.hasMany(Bid, { foreignKey: 'userId' });
Bid.belongsTo(User);

export { sequelize, Auction, Bid, User };
