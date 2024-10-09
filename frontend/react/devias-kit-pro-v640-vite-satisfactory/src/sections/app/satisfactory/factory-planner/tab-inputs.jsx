import InputsTable from './tab-inputs/inputs-table';

const TabInputs = ({ inputs, setInputs }) => {
  return (
    <>
      <InputsTable
        inputs={inputs}
        setInputs={setInputs}
      />
    </>
  );
};

export default TabInputs;
