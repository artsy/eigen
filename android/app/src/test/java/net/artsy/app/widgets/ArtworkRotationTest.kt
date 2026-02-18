package net.artsy.app.widgets

import android.content.Context
import android.content.SharedPreferences
import io.mockk.*
import net.artsy.app.widgets.models.Artwork
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import java.text.SimpleDateFormat
import java.util.*

class ArtworkRotationTest {

    private lateinit var widgetProvider: FullBleedWidgetProvider
    private lateinit var mockContext: Context
    private lateinit var mockSharedPreferences: SharedPreferences
    private lateinit var mockEditor: SharedPreferences.Editor

    @Before
    fun setUp() {
        widgetProvider = FullBleedWidgetProvider()
        mockContext = mockk()
        mockSharedPreferences = mockk()
        mockEditor = mockk(relaxed = true)

        every { mockContext.getSharedPreferences("fullbleed_widget_prefs", Context.MODE_PRIVATE) } returns mockSharedPreferences
        every { mockSharedPreferences.edit() } returns mockEditor
        every { mockEditor.putString(any(), any()) } returns mockEditor
        every { mockEditor.putInt(any(), any()) } returns mockEditor
        every { mockEditor.apply() } just Runs
    }

    @After
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `artwork rotation progresses sequentially through list`() {
        val artworks = createArtworkList(5)
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        // First call - should start at index 0
        every { mockSharedPreferences.getString("date_$widgetId", "") } returns ""
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 0
        
        var result = invokeGetNextArtwork(widgetId, artworks)
        assertEquals("First call should return first artwork", artworks[0], result)

        // Second call - should move to index 1
        every { mockSharedPreferences.getString("date_$widgetId", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 0
        
        result = invokeGetNextArtwork(widgetId, artworks)
        assertEquals("Second call should return second artwork", artworks[1], result)

        // Third call - should move to index 2
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 1
        
        result = invokeGetNextArtwork(widgetId, artworks)
        assertEquals("Third call should return third artwork", artworks[2], result)
    }

    @Test
    fun `artwork rotation wraps around at end of list`() {
        val artworks = createArtworkList(3)
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        // Start at last index (2) for a list of 3 items
        every { mockSharedPreferences.getString("date_$widgetId", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 2

        val result = invokeGetNextArtwork(widgetId, artworks)
        
        assertEquals("Should wrap to first artwork", artworks[0], result)
        verify { mockEditor.putInt("index_$widgetId", 0) }
    }

    @Test
    fun `artwork rotation handles single artwork list`() {
        val artworks = createArtworkList(1)
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        every { mockSharedPreferences.getString("date_$widgetId", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 0

        val result = invokeGetNextArtwork(widgetId, artworks)
        
        assertEquals("Should return the single artwork", artworks[0], result)
        verify { mockEditor.putInt("index_$widgetId", 0) }
    }

    @Test
    fun `different widgets maintain separate rotation state`() {
        val artworks = createArtworkList(5)
        val widgetId1 = 123
        val widgetId2 = 456
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        // Widget 1 at index 2
        every { mockSharedPreferences.getString("date_$widgetId1", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId1", 0) } returns 2

        // Widget 2 at index 0
        every { mockSharedPreferences.getString("date_$widgetId2", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId2", 0) } returns 0

        val result1 = invokeGetNextArtwork(widgetId1, artworks)
        val result2 = invokeGetNextArtwork(widgetId2, artworks)

        assertEquals("Widget 1 should get artwork at index 3", artworks[3], result1)
        assertEquals("Widget 2 should get artwork at index 1", artworks[1], result2)

        verify { mockEditor.putInt("index_$widgetId1", 3) }
        verify { mockEditor.putInt("index_$widgetId2", 1) }
    }

    @Test
    fun `artwork rotation resets on new day`() {
        val artworks = createArtworkList(5)
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val yesterday = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(
            Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000)
        )

        // Simulate widget was at index 3 yesterday
        every { mockSharedPreferences.getString("date_$widgetId", "") } returns yesterday
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 3

        val result = invokeGetNextArtwork(widgetId, artworks)

        assertEquals("Should reset to first artwork on new day", artworks[0], result)
        verify { mockEditor.putString("date_$widgetId", today) }
        verify { mockEditor.putInt("index_$widgetId", 0) }
    }

    @Test
    fun `artwork rotation handles large artwork list`() {
        val artworks = createArtworkList(100)
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        // Start at index 98 (near end of large list)
        every { mockSharedPreferences.getString("date_$widgetId", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 98

        val result = invokeGetNextArtwork(widgetId, artworks)

        assertEquals("Should get artwork at index 99", artworks[99], result)
        verify { mockEditor.putInt("index_$widgetId", 99) }

        // Next call should wrap around
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 99
        val nextResult = invokeGetNextArtwork(widgetId, artworks)

        assertEquals("Should wrap to first artwork", artworks[0], nextResult)
        verify { mockEditor.putInt("index_$widgetId", 0) }
    }

    @Test
    fun `artwork rotation preserves data correctly in SharedPreferences`() {
        val artworks = createArtworkList(3)
        val widgetId = 789
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        every { mockSharedPreferences.getString("date_$widgetId", "") } returns ""
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 0

        invokeGetNextArtwork(widgetId, artworks)

        verify { mockEditor.putString("date_$widgetId", today) }
        verify { mockEditor.putInt("index_$widgetId", 0) }
        verify { mockEditor.apply() }
    }


    @Test
    fun `artwork rotation handles concurrent widget updates`() {
        val artworks = createArtworkList(10)
        val widgetIds = listOf(101, 102, 103, 104, 105)
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        // Simulate multiple widgets at different states
        widgetIds.forEachIndexed { index, widgetId ->
            every { mockSharedPreferences.getString("date_$widgetId", "") } returns today
            every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns index
        }

        // Update all widgets and verify they each get the next artwork in sequence
        widgetIds.forEachIndexed { index, widgetId ->
            val result = invokeGetNextArtwork(widgetId, artworks)
            val expectedIndex = (index + 1) % artworks.size
            assertEquals("Widget $widgetId should get artwork at index $expectedIndex", 
                         artworks[expectedIndex], result)
            verify { mockEditor.putInt("index_$widgetId", expectedIndex) }
        }
    }

    private fun createArtworkList(count: Int): List<Artwork> {
        return (1..count).map { index ->
            mockk<Artwork> {
                every { id } returns "artwork_$index"
                every { title } returns "Artwork $index"
                every { url } returns "https://artsy.net/artwork/artwork_$index"
            }
        }
    }

    private fun invokeGetNextArtwork(widgetId: Int, artworks: List<Artwork>): Artwork? {
        val method = FullBleedWidgetProvider::class.java.getDeclaredMethod(
            "getNextArtwork", 
            Context::class.java, 
            Int::class.java, 
            List::class.java
        )
        method.isAccessible = true
        return method.invoke(widgetProvider, mockContext, widgetId, artworks) as Artwork?
    }
}