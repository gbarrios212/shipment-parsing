import * as utils from './shipment-utils.js';

const example = 'SH348503,O567843,2018-12-10 15:08:58 -0000,Jane,Smith,\nSH465980,O936726,2018-12-11 06:08:14 -0000,John,Reynolds,\nSH465994,O936726,2018-12-11 06:12:37 -0000,John,Reynolds,\nSH867263,O234934,2018-12-11 18:28:51 -0000,Rebecca,Jones,\nSH907346,,2018-12-12 21:12:28 -0000,Rebecca,Jones,SH867263\nSH927813,,2018-12-15 09:49:35 -0000,Rebecca,Jones,SH907346\n'

// Requirement One
const formattedShipments = utils.formatShipments(example);
console.log(' ------ Requirement One ------ ');
console.log(formattedShipments);
console.log(' ------ ------ ------ ------ ------ ');


const shipmentOne = 'SH348503';
const shipmentTwo = 'SH465980';
const shipmentThree = 'SH465994';
const shipmentFour = 'SH867263';
const shipmentFive = 'SH907346';
const shipmentSix = 'SH927813';
const shipmentSeven = 'NULL';

console.log(' ------ Requirement Two ------ ');
const shipmentOneProperties = utils.getShipmentProperties(example, shipmentOne);
console.log(shipmentOneProperties);

const shipmentTwoProperties = utils.getShipmentProperties(example, shipmentTwo);
console.log(shipmentTwoProperties);

const shipmentThreeProperties = utils.getShipmentProperties(example, shipmentThree);
console.log(shipmentThreeProperties);

const shipmentFourProperties = utils.getShipmentProperties(example, shipmentFour);
console.log(shipmentFourProperties);

const shipmentFiveProperties = utils.getShipmentProperties(example, shipmentFive);
console.log(shipmentFiveProperties);

const shipmentSixProperties = utils.getShipmentProperties(example, shipmentSix);
console.log(shipmentSixProperties);

const shipmentSevenProperties = utils.getShipmentProperties(example, shipmentSeven);
console.log(shipmentSevenProperties);
console.log(' ------ ------ ------ ------ ------ ');

console.log(' ------ Requirement Three ------ ');
const shipmentOneComputedProperties = utils.getComputedShipmentProperties(example, shipmentOne);
console.log(shipmentOneComputedProperties);
console.log(' ------ ------ ------ ------ ------ ');

console.log(' ------ Requirement Four ------ ');
const shipmentOrderNumber = 'O234934';
const shipmentOrderProperties = utils.getAllOrderProperties(example, shipmentOrderNumber);
console.log(shipmentOrderProperties);
console.log(' ------ ------ ------ ------ ------ ');

console.log(' ------ Requirement Five ------ ');
const sortedShpiments = utils.getSortedShipments(example);
console.log(sortedShpiments);
console.log(' ------ ------ ------ ------ ------ ');
