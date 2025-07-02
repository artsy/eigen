package net.artsy.app.widgets

import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.SharedPreferences
import android.graphics.Bitmap
import android.os.Bundle
import io.mockk.*
import net.artsy.app.widgets.models.Artwork
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import java.text.SimpleDateFormat
import java.util.*

class FullBleedWidgetProviderTest {

    private lateinit var widgetProvider: FullBleedWidgetProvider
    private lateinit var mockContext: Context
    private lateinit var mockAppWidgetManager: AppWidgetManager
    private lateinit var mockSharedPreferences: SharedPreferences
    private lateinit var mockEditor: SharedPreferences.Editor

    @Before
    fun setUp() {
        widgetProvider = FullBleedWidgetProvider()
        mockContext = mockk()
        mockAppWidgetManager = mockk()
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
    fun `getNextArtwork returns null for empty list`() {
        val artworks = emptyList<Artwork>()
        val widgetId = 123

        // Use reflection to access private method
        val method = FullBleedWidgetProvider::class.java.getDeclaredMethod("getNextArtwork", Context::class.java, Int::class.java, List::class.java)
        method.isAccessible = true
        val result = method.invoke(widgetProvider, mockContext, widgetId, artworks) as Artwork?

        assertNull(result)
    }

    @Test
    fun `getNextArtwork returns first artwork for new widget`() {
        val artworks = listOf(
            createMockArtwork("1", "Art 1"),
            createMockArtwork("2", "Art 2"),
            createMockArtwork("3", "Art 3")
        )
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        every { mockSharedPreferences.getString("date_$widgetId", "") } returns ""
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 0

        val method = FullBleedWidgetProvider::class.java.getDeclaredMethod("getNextArtwork", Context::class.java, Int::class.java, List::class.java)
        method.isAccessible = true
        val result = method.invoke(widgetProvider, mockContext, widgetId, artworks) as Artwork?

        assertEquals(artworks[0], result)
        verify { mockEditor.putString("date_$widgetId", today) }
        verify { mockEditor.putInt("index_$widgetId", 0) }
    }

    @Test
    fun `getNextArtwork rotates to next artwork on same day`() {
        val artworks = listOf(
            createMockArtwork("1", "Art 1"),
            createMockArtwork("2", "Art 2"),
            createMockArtwork("3", "Art 3")
        )
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        every { mockSharedPreferences.getString("date_$widgetId", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 0

        val method = FullBleedWidgetProvider::class.java.getDeclaredMethod("getNextArtwork", Context::class.java, Int::class.java, List::class.java)
        method.isAccessible = true
        val result = method.invoke(widgetProvider, mockContext, widgetId, artworks) as Artwork?

        assertEquals(artworks[1], result) // Should get index 1 (next artwork)
        verify { mockEditor.putInt("index_$widgetId", 1) }
    }

    @Test
    fun `getNextArtwork wraps around at end of list`() {
        val artworks = listOf(
            createMockArtwork("1", "Art 1"),
            createMockArtwork("2", "Art 2")
        )
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        every { mockSharedPreferences.getString("date_$widgetId", "") } returns today
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 1 // At last index

        val method = FullBleedWidgetProvider::class.java.getDeclaredMethod("getNextArtwork", Context::class.java, Int::class.java, List::class.java)
        method.isAccessible = true
        val result = method.invoke(widgetProvider, mockContext, widgetId, artworks) as Artwork?

        assertEquals(artworks[0], result) // Should wrap to index 0
        verify { mockEditor.putInt("index_$widgetId", 0) }
    }

    @Test
    fun `getNextArtwork resets to first artwork on new day`() {
        val artworks = listOf(
            createMockArtwork("1", "Art 1"),
            createMockArtwork("2", "Art 2"),
            createMockArtwork("3", "Art 3")
        )
        val widgetId = 123
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val yesterday = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000))

        every { mockSharedPreferences.getString("date_$widgetId", "") } returns yesterday
        every { mockSharedPreferences.getInt("index_$widgetId", 0) } returns 2

        val method = FullBleedWidgetProvider::class.java.getDeclaredMethod("getNextArtwork", Context::class.java, Int::class.java, List::class.java)
        method.isAccessible = true
        val result = method.invoke(widgetProvider, mockContext, widgetId, artworks) as Artwork?

        assertEquals(artworks[0], result) // Should reset to first artwork
        verify { mockEditor.putString("date_$widgetId", today) }
        verify { mockEditor.putInt("index_$widgetId", 0) }
    }


    private fun createMockArtwork(id: String, title: String): Artwork {
        return mockk<Artwork> {
            every { this@mockk.id } returns id
            every { this@mockk.title } returns title
            every { url } returns "https://artsy.net/artwork/$id"
        }
    }
}