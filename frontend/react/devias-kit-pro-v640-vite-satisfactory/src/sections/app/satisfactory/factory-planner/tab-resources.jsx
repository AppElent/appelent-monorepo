import ResourceInputsTable from './tab-resources/resource-inputs-table';

const TabResources = ({ resources, setResources }) => {
  return (
    <>
      <ResourceInputsTable
        resources={resources}
        setResources={setResources}
      />
    </>
  );
};

export default TabResources;
