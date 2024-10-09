import PreferredRecipesTable from '../calculations/preferred-recipes-table';

const TabRecipes = ({ recipes, setRecipes }) => {
  return (
    <>
      <PreferredRecipesTable
        preferredRecipes={recipes || []}
        setPreferredRecipes={setRecipes}
      />
    </>
  );
};

export default TabRecipes;
