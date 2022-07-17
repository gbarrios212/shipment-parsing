import * as utils from './shipment-utils';

const shipmentString = 'SH348503,O567843,2018-12-10 15:08:58 -0000,Jane,Smith';
const example = 'SH348503,O567843,2018-12-10 15:08:58 -0000,Jane,Smith,\nSH465980,O936726,2018-12-11 06:08:14 -0000,John,Reynolds,\nSH465994,O936726,2018-12-11 06:12:37 -0000,John,Reynolds,\nSH867263,O234934,2018-12-11 18:28:51 -0000,Rebecca,Jones,\nSH907346,,2018-12-12 21:12:28 -0000,Rebecca,Jones,SH867263\nSH927813,,2018-12-15 09:49:35 -0000,Rebecca,Jones,SH907346\n';

describe('convertToShipmentObject', () => {
    it('converts a string shipment value into an object of shipment properties', () => {
        const shipmentObject = {
            "firstName": "Jane",
            "lastName": "Smith",
            "orderNumber": "O567843",
            "shipmentDate": "2018-12-10 15:08:58 -0000",
            "shipmentNumber": "SH348503",
        };

        const output = utils.convertToShipmentObject(shipmentString);
        expect(output).toStrictEqual(shipmentObject);
    })
});


describe('convertToArray', () => {
    it('converts string shipment values to an array', () => {
        const output = utils.convertToShipmentArray(example);
        expect(output).toStrictEqual(
            [
                {
                    "SH348503": {
                        "firstName": "Jane",
                        "lastName": "Smith",
                        "orderNumber": "O567843",
                        "parentShipment": "",
                        "shipmentDate": "2018-12-10 15:08:58 -0000",
                        "shipmentNumber": "SH348503",
                    }
                },
                {
                    "SH465980": {
                        "firstName": "John",
                        "lastName": "Reynolds",
                        "orderNumber": "O936726",
                        "parentShipment": "",
                        "shipmentDate": "2018-12-11 06:08:14 -0000",
                        "shipmentNumber": "SH465980",
                    }
                }, 
                {
                    "SH465994": {
                        "firstName": "John",
                        "lastName": "Reynolds",
                        "orderNumber": "O936726",
                        "parentShipment": "",
                        "shipmentDate": "2018-12-11 06:12:37 -0000",
                        "shipmentNumber": "SH465994",
                    }
                },
                {
                    "SH867263": {
                        "firstName": "Rebecca",
                        "lastName": "Jones",
                        "orderNumber": "O234934",
                        "parentShipment": "",
                        "shipmentDate": "2018-12-11 18:28:51 -0000",
                        "shipmentNumber": "SH867263",
                    }
                },
                {
                    "SH907346": {
                        "firstName": "Rebecca",
                        "lastName": "Jones",
                        "orderNumber": "",
                        "parentShipment": "SH867263",
                        "shipmentDate": "2018-12-12 21:12:28 -0000",
                        "shipmentNumber": "SH907346"
                    }
                },
                {
                    "SH927813": {
                        "firstName": "Rebecca",
                        "lastName": "Jones",
                        "orderNumber": "",
                        "parentShipment": "SH907346",
                        "shipmentDate": "2018-12-15 09:49:35 -0000",
                        "shipmentNumber": "SH927813"
                    }
                }
            ]
        );
    })
});


describe('formatShipment', () => {
    it('separates string shipment details into readable text', () => {
        const output = utils.formatShipments(example);
        expect(output).toBe
(`Shipment #1:
Number: SH348503 Order Number: O567843, Shipped: 2018-12-10 15:08:58 -0000, First Name: Jane, Last Name: Smith, Parent Shipment: N/A

Shipment #2:
Number: SH465980 Order Number: O936726, Shipped: 2018-12-11 06:08:14 -0000, First Name: John, Last Name: Reynolds, Parent Shipment: N/A

Shipment #3:
Number: SH465994 Order Number: O936726, Shipped: 2018-12-11 06:12:37 -0000, First Name: John, Last Name: Reynolds, Parent Shipment: N/A

Shipment #4:
Number: SH867263 Order Number: O234934, Shipped: 2018-12-11 18:28:51 -0000, First Name: Rebecca, Last Name: Jones, Parent Shipment: N/A

Shipment #5:
Number: SH907346 Order Number: N/A, Shipped: 2018-12-12 21:12:28 -0000, First Name: Rebecca, Last Name: Jones, Parent Shipment: SH867263

Shipment #6:
Number: SH927813 Order Number: N/A, Shipped: 2018-12-15 09:49:35 -0000, First Name: Rebecca, Last Name: Jones, Parent Shipment: SH907346

`);
    })
});


describe('getShipmentProperties', () => {
    it("returns a shipment's properties by shipment number", () => {
        const shipmentNumber = 'SH348503';
        const properties = utils.getShipmentProperties(shipmentString, shipmentNumber);
        expect(properties).toStrictEqual(
            {
                "firstName": "Jane",
                "lastName": "Smith",
                "orderNumber": "O567843",
                "shipmentDate": "2018-12-10 15:08:58 -0000",
                "shipmentNumber": "SH348503"
            }
        );
    });

    it('returns no shipment if none is found', () => {
        const shipmentNumber = 'NULL';
        const properties = utils.getShipmentProperties(shipmentString, shipmentNumber);
        expect(properties).toBe(`No shipment with number ${shipmentNumber} found`);
    })
});


describe('getComputedShipmentProperties', () => {
    it('returns shipment properties with full names and time elapsed since shipment', () => {
        const shipmentNumber = 'SH348503';
        const properties = utils.getComputedShipmentProperties(shipmentString, shipmentNumber);
        expect(properties.fullName).toBe('Jane Smith');
    });
});


describe('getAllOrderProperties', () => {
    it('returns a shipment if associated with an order number', () => {
        const output = utils.getAllOrderProperties(example, 'O567843');
        expect(output).toStrictEqual(
            [
                {
                    shipmentNumber: 'SH348503',
                    orderNumber: 'O567843',
                    shipmentDate: '2018-12-10 15:08:58 -0000',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    parentShipment: '',
                    fullName: 'Jane Smith',
                    daysAgoShipped: utils.getDaysAgo('2018-12-10 15:08:58 -0000'), 
                }
            ]
        );
    });

    it('returns all shipments associated with an order number', () => {
        const shipmentString = 'SH867263,O234934,2018-12-11 18:28:51 -0000,Rebecca,Jones,\nSH907346,,2018-12-12 21:12:28 -0000,Rebecca,Jones,SH867263\nSH927813,,2018-12-15 09:49:35 -0000,Rebecca,Jones,SH907346\n';
        const output = utils.getAllOrderProperties(shipmentString, 'O234934');
        expect(output).toStrictEqual(
            [
                {
                    shipmentNumber: 'SH867263',
                    orderNumber: 'O234934',
                    shipmentDate: '2018-12-11 18:28:51 -0000',
                    firstName: 'Rebecca',
                    lastName: 'Jones',
                    parentShipment: '',
                    fullName: 'Rebecca Jones',
                    daysAgoShipped: utils.getDaysAgo('2018-12-11 18:28:51 -0000')
                },
                {
                    shipmentNumber: 'SH907346',
                    orderNumber: '',
                    shipmentDate: '2018-12-12 21:12:28 -0000',
                    firstName: 'Rebecca',
                    lastName: 'Jones',
                    parentShipment: 'SH867263',
                    fullName: 'Rebecca Jones',
                    daysAgoShipped: utils.getDaysAgo('2018-12-12 21:12:28 -0000')
                },
                {
                    shipmentNumber: 'SH927813',
                    orderNumber: '',
                    shipmentDate: '2018-12-15 09:49:35 -0000',
                    firstName: 'Rebecca',
                    lastName: 'Jones',
                    parentShipment: 'SH907346',
                    fullName: 'Rebecca Jones',
                    daysAgoShipped: utils.getDaysAgo('2018-12-15 09:49:35 -0000')
                }
            ]
        );
    });

    it('returns no shipments if none associated with the order number', () => {
        const orderNumber = 'NULL';
        const properties = utils.getAllOrderProperties(shipmentString, orderNumber);
        expect(properties).toBe(`No shipment(s) with order number ${orderNumber} found.`);
    });
});

describe('getSortedShipments', () => {
    it('sorts shipments according to days ago shipped in ascending order', () => {
        const output = utils.getSortedShipments(example);
        expect(output).toStrictEqual(
            [
                {
                    shipmentNumber: 'SH927813',
                    orderNumber: '',
                    shipmentDate: '2018-12-15 09:49:35 -0000',
                    firstName: 'Rebecca',
                    lastName: 'Jones',
                    parentShipment: 'SH907346',
                    fullName: 'Rebecca Jones',
                    daysAgoShipped: utils.getDaysAgo('2018-12-15 09:49:35 -0000')
                },
                {
                    shipmentNumber: 'SH907346',
                    orderNumber: '',
                    shipmentDate: '2018-12-12 21:12:28 -0000',
                    firstName: 'Rebecca',
                    lastName: 'Jones',
                    parentShipment: 'SH867263',
                    fullName: 'Rebecca Jones',
                    daysAgoShipped: utils.getDaysAgo('2018-12-12 21:12:28 -0000')
                },
                {
                    shipmentNumber: 'SH867263',
                    orderNumber: 'O234934',
                    shipmentDate: '2018-12-11 18:28:51 -0000',
                    firstName: 'Rebecca',
                    lastName: 'Jones',
                    parentShipment: '',
                    fullName: 'Rebecca Jones',
                    daysAgoShipped: utils.getDaysAgo('2018-12-11 18:28:51 -0000')
                },
                {
                    shipmentNumber: 'SH465980',
                    orderNumber: 'O936726',
                    shipmentDate: '2018-12-11 06:08:14 -0000',
                    firstName: 'John',
                    lastName: 'Reynolds',
                    parentShipment: '',
                    fullName: 'John Reynolds',
                    daysAgoShipped: utils.getDaysAgo('2018-12-11 06:08:14 -0000')
                },
                {
                    shipmentNumber: 'SH465994',
                    orderNumber: 'O936726',
                    shipmentDate: '2018-12-11 06:12:37 -0000',
                    firstName: 'John',
                    lastName: 'Reynolds',
                    parentShipment: '',
                    fullName: 'John Reynolds',
                    daysAgoShipped: utils.getDaysAgo('2018-12-11 06:12:37 -0000')
                },
                {
                    shipmentNumber: 'SH348503',
                    orderNumber: 'O567843',
                    shipmentDate: '2018-12-10 15:08:58 -0000',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    parentShipment: '',
                    fullName: 'Jane Smith',
                    daysAgoShipped: utils.getDaysAgo('2018-12-10 15:08:58 -0000')
                }
            ]
        )
    })
});
