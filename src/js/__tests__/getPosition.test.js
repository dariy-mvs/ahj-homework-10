import Modal from '../Modal';

test('validation', () => {
  const input = '51.50851, -0.12572';
  const validationValue = Modal.validationString(input);
  expect(validationValue).toBe(true);
});

test('validation2', () => {
  const input = '[51.50851, -0.12572]';
  const validationValue = Modal.validationString(input);
  expect(validationValue).toBe(true);
});

test('validation3', () => {
  const input = '51.50851,-0.12572';
  const validationValue = Modal.validationString(input);
  expect(validationValue).toBe(true);
});

test('validation4', () => {
  const input = '51.-0.12572';
  const validationValue = Modal.validationString(input);
  expect(validationValue).toBe(false);
});

test('validation5', () => {
  const input = '[511257-0.12572]';
  const validationValue = Modal.validationString(input);
  expect(validationValue).toBe(false);
});

test('validation6', () => {
  const input = '[-511257- -0.12572]';
  const validationValue = Modal.validationString(input);
  expect(validationValue).toBe(false);
});
