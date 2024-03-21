// helpers.js

export const getAvailableNumbers = async (baseUrl, description) => {
  

    try {
      const response = await fetch(`${baseUrl}/instruments?description=${description}`);
      if (!response.ok) {
        throw new Error('Error occurred');
      }
      const instruments = await response.json();
      let usedNumbers = instruments.map(instrument => instrument.number);
      let maxNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0;
      let nextAvailable = maxNumber + 1;
      let availableNumbers = [];
      for (let i = 1; i <= maxNumber; i++) {
        if (!usedNumbers.includes(i)) {
          availableNumbers.push(i);
        }
      }
      availableNumbers.unshift(nextAvailable);
      return availableNumbers;
    } catch (error) {
      console.error('Error fetching available numbers:', error);
      throw error;
    }
  };
  
  export const getEquipment = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/equipment`);
      if (!response.ok) {
        throw new Error('Failed to fetch equipment data');
      }
      const equipmentData = await response.json();
      return equipmentData.map(item => item.description);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
      throw error;
    }
  };

  export const getExistingEquipment = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/equipment/existing`);
      if (!response.ok) {
        throw new Error('Failed to fetch equipment data');
      }
      const equipmentData = await response.json();
      return equipmentData.map(item => item.description);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
      throw error;
    }
  };

  export const getLocations = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/instruments/location`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const locationsData = await response.json();
      return locationsData.map(item => item.room);
    } catch (error) {
      console.error('Error fetching locations data:', error);
      throw error;
    }
  };

  export const getInstrumentStates = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/instruments/states`);
      if (!response.ok) {
        throw new Error('Failed to fetch States');
      }
      const conditionsData = await response.json();
      return conditionsData.map(item => item.condition);
    } catch (error) {
      console.error('Error fetching conditions data:', error);
      throw error;
    }
  };
  