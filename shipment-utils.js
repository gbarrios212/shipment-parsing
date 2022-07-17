export function convertToShipmentObject(shipment) {
    const shipmentProperties = [
        'shipmentNumber',
        'orderNumber',
        'shipmentDate',
        'firstName',
        'lastName',
        'parentShipment',
    ]
    const shipmentArray = shipment.split(',');
    
    let newShipmentObject = {};

    for(let i = 0; i < shipmentArray.length; i ++) {
        const property = shipmentProperties[i];
        const value = shipmentArray[i];
        newShipmentObject[property] = value;
    }

    return newShipmentObject;
};


export function convertToShipmentArray(shipmentDetails) {
    const shipments = shipmentDetails.trim().split('\n');
    let newShipments = [];
    for(const shipment of shipments) {
        const shipmentObject = convertToShipmentObject(shipment);
        newShipments.push({
            [shipmentObject.shipmentNumber]: shipmentObject
        });
    }

    return newShipments;
};


export function formatShipments(shipmentDetails) {
    const newShipments = convertToShipmentArray(shipmentDetails);

    let output = '';

    for(let i = 0; i < newShipments.length; i ++) {
        const shipment = Object.values(newShipments[i])[0];
        const { shipmentNumber, orderNumber, shipmentDate, firstName, lastName, parentShipment } = shipment;
        output += `Shipment #${i + 1}:\nNumber: ${shipmentNumber} Order Number: ${orderNumber || 'N/A'}, Shipped: ${shipmentDate}, First Name: ${firstName}, Last Name: ${lastName}, Parent Shipment: ${parentShipment || 'N/A'}\n\n`
    }

    return output
};


export function getShipmentProperties(shipmentDetails, shipmentNumber) {
    const shipments = convertToShipmentArray(shipmentDetails)

    for(const shipment of shipments) {
        const shipmentProperties = Object.values(shipment)[0]
        if (shipmentProperties.shipmentNumber === shipmentNumber) return shipmentProperties;
    }

    return `No shipment with number ${shipmentNumber} found`;
};


export function getDaysAgo(dateString) {
    const previousDate = new Date(dateString);
    const currDate = new Date();
    const millisecondsSince = currDate - previousDate;
    return Math.floor(millisecondsSince/(1000 * 60 * 60 * 24));
};


export function getComputedShipmentProperties(shipmentDetails, shipmentNumber) {
    const shipmentProperties = getShipmentProperties(shipmentDetails, shipmentNumber);
    const fullName = shipmentProperties.firstName + ' ' + shipmentProperties.lastName;
    const daysAgoShipped = getDaysAgo(shipmentProperties.shipmentDate);
    return {
        ...shipmentProperties,
        fullName,
        daysAgoShipped
    }
};


export function findShipmentLineage(shipments, currShipment, shipmentsVisited, lineage) {
    let shipment = currShipment;
    while (shipment && !shipmentsVisited[shipment.shipmentNumber]) {
        lineage.push(shipment);
        shipmentsVisited[shipment.shipmentNumber] = true;
        shipment = shipments[shipment.parentShipment];
    }
    return lineage
}


export function getAllOrderProperties(shipmentDetails, orderNumber) {
    const shipmentsArray = convertToShipmentArray(shipmentDetails);
    const shipmentsObject = Object.assign({}, ...shipmentsArray);

    const shipmentsVisited = {};
    let shipmentOrders = {};
    for(const shipmentNumber in shipmentsObject) {
        const shipmentProperties = shipmentsObject[shipmentNumber];
        if (!shipmentProperties.orderNumber && !shipmentsVisited[shipmentProperties.shipmentNumber]) {
            const shipmentLineage = findShipmentLineage(shipmentsObject, shipmentProperties, shipmentsVisited, [])
            const parentShipment = shipmentLineage[shipmentLineage.length - 1];
            if (parentShipment.orderNumber === orderNumber || shipmentOrders[parentShipment.parentShipment]){
                for(const shipment of shipmentLineage) {
                    shipmentOrders[shipmentNumber] = (shipment);
                }
            }
        } else if (shipmentProperties.orderNumber === orderNumber) {
            shipmentOrders[shipmentNumber] = shipmentProperties;
            shipmentsVisited[shipmentNumber] = true;
        }
    }
   
    const allOrders = Object.values(shipmentOrders).map(
        (shipment) => getComputedShipmentProperties(shipmentDetails, shipment.shipmentNumber)
    );
    
    return allOrders.length ? allOrders : `No shipment(s) with order number ${orderNumber} found.`;
};

export function getSortedShipments(shipmentDetails) {
    const shipmentsArray = convertToShipmentArray(shipmentDetails);
    const statefulShipments = shipmentsArray.map(shipment => getComputedShipmentProperties(shipmentDetails, Object.keys(shipment)[0]));

    return statefulShipments.sort((a, b) => {
       return a.daysAgoShipped - b.daysAgoShipped;
    });
};

