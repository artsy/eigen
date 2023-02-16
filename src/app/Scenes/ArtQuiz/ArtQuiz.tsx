import { ArtQuizQuery } from "__generated__/ArtQuizQuery.graphql"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { ArtQuizResults } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResults"
import { ArtQuizWelcome } from "app/Scenes/ArtQuiz/ArtQuizWelcome"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const ArtQuizScreen: React.FC = () => {
  const quizCompleted = useLazyLoadQuery<ArtQuizQuery>(artQuizQuery, {}).me?.quiz.completedAt

  if (quizCompleted) {
    return <ArtQuizResults />
  }

  return <ArtQuizWelcome />
}

export const ArtQuiz = () => {
  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuizScreen />
    </Suspense>
  )
}

const artQuizQuery = graphql`
  query ArtQuizQuery {
    me {
      quiz {
        completedAt
      }
    }
  }
`
