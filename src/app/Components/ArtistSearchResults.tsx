import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { useArtistSearch } from "app/utils/hooks/useArtistSearch"
import { limitWithCount } from "app/utils/limitWithCount"
import { Text, TouchableOpacity, View } from "react-native"

interface ArtistSearchResultsProps {
  query: string
  userEmail?: string
  onSelect: (artistID: string) => void
}

export const ArtistSearchResults: React.FC<ArtistSearchResultsProps> = ({
  query,
  userEmail,
  onSelect,
}) => {
  const { results, loading } = useArtistSearch(query, userEmail)
  const names = limitWithCount(
    results.map((artist) => artist.name),
    3
  )

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Text style={{ color: "#BBBBBB", fontSize: 12 }}>{names.join(", ")}</Text>
      {results.map((artist, index) => (
        <TouchableOpacity
          accessibilityRole="button"
          key={index}
          onPress={() => onSelect(artist.id)}
        >
          <Text>
            {artist.name} · {formatLargeNumber(artist.worksCount)} works
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
