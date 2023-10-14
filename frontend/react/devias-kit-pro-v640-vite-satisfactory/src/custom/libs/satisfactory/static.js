export const VEHICLE_IMAGES = {
  locomotive: '/assets/satisfactory/buildables/Desc_Locomotive_C.jpg',
  freight: '/assets/satisfactory/buildables/Desc_FreightWagon_C.jpg',
  truck: '/assets/satisfactory/buildables/Desc_Truck_C.jpg',
  tractor: '/assets/satisfactory/buildables/Desc_Tractor_C.jpg',
  drone: '/assets/satisfactory/buildables/Desc_DroneTransport_C.jpg',
  explorer: '/assets/satisfactory/buildables/Desc_Explorer_C.jpg',
  cyber: '/assets/satisfactory/buildables/Desc_CyberWagon_C.jpg',
};

export const STATION_IMAGES = {
  station: '/assets/satisfactory/buildables/Desc_TrainStation_C.jpg',
  freight: '/assets/satisfactory/buildables/Desc_TrainDockingStation_C.jpg',
  fluid: '/assets/satisfactory/buildables/Desc_TrainDockingStationLiquid_C.jpg',
  empty: '/assets/satisfactory/buildables/Desc_TrainPlatformEmpty_C.jpg',
  drone: '/assets/satisfactory/buildables/Desc_DroneStation_C.jpg',
  truck: '/assets/satisfactory/buildables/Desc_TruckStation_C.jpg',
};

export const VEHICLE_TYPES = [
  { label: 'Train', key: 'train', station: 'train' },
  { label: 'Truck', key: 'truck', station: 'truck' },
  { label: 'Tractor', key: 'tractor', station: 'truck' },
  { label: 'Drone', key: 'drone', station: 'drone' },
  { label: 'Explorer', key: 'explorer', station: 'truck' },
  { label: 'Cyberwagon', key: 'cyber', station: 'truck' },
];

export const STATION_TYPES = [
  { label: 'Train station', key: 'train' },
  { label: 'Truck station', key: 'truck' },
  { label: 'Drone station', key: 'drone' },
];

export const PLATFORM_TYPES = {
  station: 'Station',
  empty: 'Empty platform',
  freight: 'Freight platform',
  fluid: 'Fluid platform',
};
