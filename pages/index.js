//to connect to contentful
import { createClient } from 'contentful';
import RecipeCard from '../components/RecipeCard';

//"getStaticProps" grab data and inject as props to display in browser
export async function getStaticProps(){

  //make connection to contentful space
  const clients = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  })
  //function to get items from content space
  //content_type specifies which content to grab through the id
  const res = await clients.getEntries({ content_type: 'recipe'})
  return{
    props: {
      recipes: res.items,
      revalidate: 1
    }
  }

}

export default function Recipes({ recipes }) {
  console.log(recipes);
  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.sys.id} recipe = {recipe}  />
      ))}

      <style jsx> {`
        .recipe-list{
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 6px;
        }
      `}</style>

    </div>
  )
}

