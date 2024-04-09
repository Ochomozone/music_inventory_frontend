import { render, screen } from '@testing-library/react';
import App from './App';
import { getAvailableNumbers } from './util/helpers';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


it('should return an array of available numbers when given a valid baseUrl and description', async () => {
  const baseUrl = 'http://localhost:4001';
  const description = 'TUBA';
  const instruments = [
    { number: 8 },
    { number: 6 },
  ];
  const response = { ok: true, json: jest.fn().mockResolvedValue(instruments) };
  global.fetch = jest.fn().mockResolvedValue(response);

  const result = await getAvailableNumbers(baseUrl, description);

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}/instruments?description=${description}`);
  expect(response.json).toHaveBeenCalled();
  expect(result).toEqual([1, 2, 3, 4]);
});