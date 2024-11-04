import styled from "styled-components";

export const DataTableStyled = styled.div`
  height: calc(100% - 10px);
  max-height: calc(100% - 10px);
  width: calc(100% - 2px);
  max-width: calc(100% - 2px);
  overflow-y: scroll;
  overflow-x: scroll;
  table {
    width: 100%;
    border-collapse: collapse;
  }
  .icon {
    font-size: 2rem;
  }

  tr {
    cursor: pointer;
    &:hover:not(.selected) {
      background-color: var(--color-primary-50);
    }
  }
  .selected {
    background-color: var(--color-primary-200);
  }
  th {
    text-align: left;
    font-size: 1.1rem;
    font-weight: 400;
    text-transform: capitalize;
    padding: 0.4rem 0.2rem;
  }
  thead {
    tr:hover {
      background-color: var(--color-primary-dark) !important;
      cursor: default;
    }
    position: sticky;
    top: 0;
    background-color: var(--color-primary-dark);
    color: white;
  }
`;
