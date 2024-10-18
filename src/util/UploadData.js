import Papa from 'papaparse';

export const uploadCsv = async (file) => {
  return new Promise((resolve, reject) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const csvData = e.target.result;

          // Using PapaParse to parse the CSV data
          Papa.parse(csvData, {
            header: true, // Automatically detects the headers and returns an array of objects
            skipEmptyLines: true,
            complete: (results) => {
              // Replace 'NULL' string with actual null in each field
              const cleanedData = results.data.map(record => {
                return Object.fromEntries(
                  Object.entries(record).map(([key, value]) => [
                    key,
                    value === 'NULL' ? null : value // Replace 'NULL' with null
                  ])
                );
              });
              resolve(cleanedData); // The cleaned CSV data as JSON
            },
            error: (error) => {
              reject(new Error('Error parsing CSV file: ' + error.message));
            }
          });
        } catch (error) {
          reject(new Error('Error reading CSV file: ' + error.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('File could not be read'));
      };

      reader.readAsText(file, 'utf-8'); // Reads the file as text with UTF-8 encoding
    } else {
      reject(new Error('Please upload a valid CSV file'));
    }
  });
};


export const uploadJson = async (file) => {
    return new Promise((resolve, reject) => {
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            resolve(jsonData);
          } catch (error) {
            reject(new Error('Error parsing JSON file: ' + error.message));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('File could not be read'));
        };
  
        reader.readAsText(file);
      } else {
        reject(new Error('Please upload a valid JSON file'));
      }
    });
  };

