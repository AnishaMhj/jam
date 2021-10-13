
import { createClient } from 'contentful';
import Image from "next/image";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Skeleton from '../../components/Skeleton';

//find paths or routes of the specific pages generated

//not inside a function as it is used at two more places
const clients = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})

//to generate paths and pages
export const getStaticPaths = async() =>{
  const res = await clients.getEntries({
    content_type: 'recipe'
  })

  const paths = res.items.map(item => {
    return{
      params: { slug: item.fields.slug }
    }
  })

  return {
    paths,
    fallback: true    // when value= false, if path/slug that doesnot exists is visited, it will show a 404 page instead of fallback page
  }
}


//for each path generated, runs to fetch the single item
export async function getStaticProps({ params }) {
  const { items } = await clients.getEntries({ 
    content_type: 'recipe',
    'fields.slug': params.slug
  })

  // function to redirect to homepage when the visited page doesnot exist
  if (!items.length) {
   return{
    redirect: {
      destination: '/',
      permanent: false
    }
   }
  }

  return{
    props: { recipe: items[0] },
    revalidate: 1
  }

}


export default function RecipeDetails({ recipe }) {
  if(!recipe) return <Skeleton/>
  
  const { featuredImage, title, cookingTime, ingredients, method} = recipe.fields;
  return (
    <div>
      <div className="banner">  
            <Image 
            src= {'https:' + featuredImage.fields.file.url}
            width= {featuredImage.fields.file.details.image.width}
            height= {featuredImage.fields.file.details.image.height}
            />
            <h2>{title}</h2>
        </div>

        <div className="info">
          <p>Take about {cookingTime} mins to cook.</p>
          <h3>Ingredients:</h3>
          {ingredients.map(ing => (
            <span key={ing}>{ing}</span>
          ))}
        </div>

        <div className="method">
          <h3>Method:</h3>
          <div>{documentToReactComponents(method)}</div>
        </div>
        <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
        `}</style>
    </div>
    
  )
}