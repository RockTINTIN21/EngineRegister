import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
    position: { type: String, required: true },
    positionLowerCase: { type: String, required: true, unique: true },
    installationPlaces: [String]
});

const PositionModelDB = mongoose.model('Position', positionSchema);

export default PositionModelDB;