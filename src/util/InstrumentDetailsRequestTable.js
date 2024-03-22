import React from 'react';

const TableComponent = ({ data }) => {
  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Description</th>
          <th>Number</th>
          <th>Serial</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {item.instruments_granted && item.instruments_granted.map((instrument, idx) => (
              <tr key={idx}>
                <td>{instrument.description}</td>
                <td>{instrument.number}</td>
                <td>{instrument.serial}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
