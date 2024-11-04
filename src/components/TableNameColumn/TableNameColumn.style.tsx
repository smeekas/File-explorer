import styled from "styled-components";

export const TableNameColumnStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  /* border: 1px solid red; */
  p {
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
  }
`;
