import EngineModelDB from './engineModelDB.js';
import PositionModelDB from "./PositionModelDB.js";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class Engine {
    async addPosition(position, installationPlace) {
        try {

            const positionLowerCase = position.toLowerCase();

            const positionExists = await PositionModelDB.findOne({ positionLowerCase });

            if (positionExists) {
                const error = new Error("Такое местонахождение уже существует");
                error.name = "position";
                throw error;
            }

            const installationPlacesArray = installationPlace
                ? installationPlace.split(',').map(place => place.trim())
                : [];

            const newPosition = new PositionModelDB({
                position,
                positionLowerCase,
                installationPlaces: installationPlacesArray
            });

            await newPosition.save();
            console.log('Позиция успешно добавлена.');
        } catch (error) {
            console.error('Ошибка при добавлении позиции:', error.message);
            throw error;
        }
    }

    async getPositions() {
        try {
            const positions = await PositionModelDB.find({});
            return positions;
        } catch (error) {
            console.error('Ошибка при получении позиций:', error.message);
            throw error;
        }
    }

    async getEngineByLocation(location) {
        try {
            const engines = await EngineModelDB.find({
                location: { $regex: new RegExp('^' + location.toLowerCase(), 'i') }
            });
            if (engines.length === 0) {
                throw new Error("Двигатели с таким местонахождением не найдены");
            }
            return engines;
        } catch (error) {
            console.error('Ошибка при поиске двигателей по местонахождению:', error.message);
            throw error;
        }
    }

    async getEngineByInstallationPlace(installationPlace) {
        try {
            const engines = await EngineModelDB.find({
                installationPlace: { $regex: new RegExp('^' + installationPlace.toLowerCase(), 'i') }
            });
            if (engines.length === 0) {
                throw new Error("Двигатели с таким местом установки не найдены");
            }
            return engines;
        } catch (error) {
            console.error('Ошибка при поиске двигателей по месту установки:', error.message);
            throw error;
        }
    }

    async getEngineByInventoryNumber(inventoryNumber) {
        try {
            const engine = await EngineModelDB.findOne({
                inventoryNumber: { $regex: new RegExp('^' + inventoryNumber.toLowerCase(), 'i') }
            });
            if (!engine) {
                throw new Error("Двигатель с таким инвентарным номером не найден");
            }
            return engine;
        } catch (error) {
            console.error('Ошибка при поиске двигателя по инвентарному номеру:', error.message);
            throw error;
        }
    }


    async getEngineById(engineId) {
        try {
            const engine = await EngineModelDB.findOne({ _id: engineId });
            if (!engine) {
                throw new Error("Двигатель с таким ID не найден");
            }
            return engine;
        } catch (error) {
            console.error('Ошибка при поиске двигателя по ID:', error.message);
            throw error;
        }
    }

    async deletePosition(position) {
        try {
            console.log('Удаление позиции:', position);

            const deletedPosition = await PositionModelDB.findOneAndDelete({ position });

            if (!deletedPosition) {
                const error = new Error("Позиция не найдена");
                error.name = "position";
                throw error;
            }

            console.log('Позиция успешно удалена.');
            return deletedPosition;
        } catch (error) {
            console.error('Ошибка при удалении позиции:', error.message);
            throw error;
        }
    }

    async addInstallationPlaceToPosition(position, installationPlace) {
        try {
            console.log('Данные из формы:', position, installationPlace);

            if (!position) {
                throw new Error("Позиция не может быть пустой");
            }

            const positionLowerCase = position.toLowerCase();
            const positionDoc = await PositionModelDB.findOne({ positionLowerCase });

            if (!positionDoc) {
                throw new Error("Местонахождение не найдено");
            }

            const newInstallationPlaces = installationPlace
                ? installationPlace.split(',').map(place => place.trim())
                : [];

            positionDoc.installationPlaces = [...new Set([...positionDoc.installationPlaces, ...newInstallationPlaces])];

            await positionDoc.save();
            console.log('Установки успешно добавлены.');
        } catch (error) {
            console.error('Ошибка при добавлении установок:', error.message);
            throw error;
        }
    }
    async deleteInstallationPlaceFromPosition(position, installationPlace) {
        try {
            console.log('Данные для удаления установки:', position, installationPlace);

            const positionLowerCase = position.toLowerCase();
            const positionDoc = await PositionModelDB.findOne({ positionLowerCase });

            if (!positionDoc) {
                throw new Error("Местонахождение не найдено");
            }

            positionDoc.installationPlaces = positionDoc.installationPlaces.filter(
                place => place !== installationPlace
            );

            await positionDoc.save();
            console.log('Место установки успешно удалено.');
        } catch (error) {
            console.error('Ошибка при удалении места установки:', error.message);
            throw error;
        }
    }

    async addEngine(title, location, installationPlace, inventoryNumber, accountNumber, type, power, coupling, status, comments, historyOfTheInstallation, historyOfTheRepair, date, imageFilePath, docFromPlace, linkOnAddressStorage) {
        console.log('Данные из формы:', title, location, installationPlace, inventoryNumber, accountNumber, type, power, coupling, status, comments, historyOfTheInstallation, historyOfTheRepair, date, imageFilePath, docFromPlace, linkOnAddressStorage);

        const engineExists = await EngineModelDB.findOne({ title: title.toLowerCase() });

        if (!engineExists) {
            const currentDate = moment().format('YYYY-MM-DD');
            const engineId = uuidv4();
            console.log('В id пришел:', imageFilePath);

            let relativeImagePath = null;
            if (imageFilePath) {
                relativeImagePath = `uploads/${path.basename(imageFilePath)}`;
            }

            const newEngine = new EngineModelDB({
                _id: engineId,
                title,
                location,
                installationPlace,
                inventoryNumber,
                accountNumber,
                type,
                power,
                coupling,
                status,
                comments: comments || 'Нет',
                historyOfTheInstallation: [
                    { installationPlace, status: 'Установлено', date: currentDate }
                ],
                historyOfTheRepair,
                date,
                imageFilePath: relativeImagePath,
                docFromPlace: docFromPlace || '',
                linkOnAddressStorage: linkOnAddressStorage || ''
            });

            await newEngine.save();
            console.log('Двигатель успешно добавлен.');
        } else {
            throw new Error("Двигатель с таким названием уже существует");
        }
    }


    async getAllEngines() {
        try {
            const engines = await EngineModelDB.find({});
            return engines;
        } catch (error) {
            console.error('Ошибка при получении всех двигателей:', error);
            throw error;
        }
    }
    async updateEngine(engineId, title, location, installationPlace, inventoryNumber, accountNumber, type, power, coupling, status, comments, newImageFilePath, docFromPlace, linkOnAddressStorage) {
        try {
            const engine = await EngineModelDB.findOne({ _id: engineId });

            if (!engine) {
                throw new Error("Двигатель с таким ID не найден");
            } else {
                console.log('Двигатель с таким ID найден, продолжаем работу...');
            }

            const currentDate = moment().format('YYYY-MM-DD');

            if (engine.installationPlace !== installationPlace) {
                engine.historyOfTheInstallation.push({
                    installationPlace,
                    status: 'Установлено',
                    date: currentDate
                });
            }
            engine.installationPlace = installationPlace;
            if (newImageFilePath && newImageFilePath !== 'null') {
                if (engine.imageFilePath && engine.imageFilePath !== 'null') {
                    const oldImagePath = path.resolve(engine.imageFilePath);
                    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                        if (!err) {
                            fs.unlink(oldImagePath, (err) => {
                                if (err) {
                                    console.error('Ошибка при удалении старого изображения:', err);
                                } else {
                                    console.log('Старое изображение успешно удалено:', oldImagePath);
                                }
                            });
                        } else {
                            console.log('Старое изображение не найдено:', oldImagePath);
                        }
                    });
                }
                engine.imageFilePath = `uploads/${path.basename(newImageFilePath)}`;
            }

            engine.title = title;
            engine.location = location;
            engine.inventoryNumber = inventoryNumber;
            engine.accountNumber = accountNumber;
            engine.type = type;
            engine.power = power;
            engine.coupling = coupling;
            engine.status = status;
            engine.comments = comments;
            engine.docFromPlace = docFromPlace || engine.docFromPlace;
            engine.linkOnAddressStorage = linkOnAddressStorage || engine.linkOnAddressStorage;

            await engine.save();
            console.log('Двигатель успешно обновлен.');
        } catch (error) {
            console.error('Ошибка при обновлении двигателя:', error.message);
            throw error;
        }
    }



    async deleteEngine(engineId) {
        try {
            console.log('Удаление двигателя с ID:', engineId);

            const engine = await EngineModelDB.findById(engineId);

            if (!engine) {
                throw new Error("Двигатель не найден");
            }

            if (engine.imageFilePath) {
                const imagePath = path.resolve(engine.imageFilePath);
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error('Ошибка при удалении изображения:', err);
                            } else {
                                console.log('Изображение успешно удалено:', imagePath);
                            }
                        });
                    } else {
                        console.log('Изображение не найдено:', imagePath);
                    }
                });
            }

            const deletedEngine = await EngineModelDB.findByIdAndDelete(engineId);

            console.log('Двигатель успешно удален.');
            return deletedEngine;
        } catch (error) {
            console.error('Ошибка при удалении двигателя:', error.message);
            throw error;
        }
    }
    async addHistoryRepair(engineId, repairType, repairDescription, repairDate) {
        try {
            console.log('Добавление записи истории ремонта:', engineId, repairType, repairDescription, repairDate);

            const engine = await EngineModelDB.findOne({ _id: engineId });

            if (!engine) {
                throw new Error("Двигатель с таким ID не найден");
            }

            const newRepairEntry = {
                repairType,
                repairDescription,
                repairDate: moment(repairDate).format('YYYY-MM-DD')
            };

            engine.historyOfTheRepair.push(newRepairEntry);

            await engine.save();

            console.log('История ремонта успешно обновлена.');
            return engine;
        } catch (error) {
            console.error('Ошибка при добавлении истории ремонта:', error.message);
            throw error;
        }
    }
}

export default Engine;