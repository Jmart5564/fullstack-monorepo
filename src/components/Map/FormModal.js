import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line react/prop-types
export default function FormModal({ open }) {
  if (!open) return null;
  return (
    <ModalDiv>
      <h1>Add New Journal Entry</h1>
      <textarea></textarea>
      <button>Submit</button>
      <button>Cancel</button>
    </ModalDiv>
  );
}

const ModalDiv = styled.div`
  width: 400px;
  height: 200px;
  background-color: white;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-end;
  z-index: 10;
  button {
    width: 70px;
    height: 30px;
  }
`;
