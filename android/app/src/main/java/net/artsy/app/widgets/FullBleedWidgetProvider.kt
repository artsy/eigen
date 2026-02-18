package net.artsy.app.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import androidx.core.net.toUri
import androidx.core.content.edit
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import net.artsy.app.R
import net.artsy.app.widgets.client.ArtsyApiClient
import net.artsy.app.widgets.models.Artwork
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class FullBleedWidgetProvider : AppWidgetProvider() {

    companion object {
        private const val TAG = "FullBleedWidget"
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        val widgetOptions = appWidgetManager.getAppWidgetOptions(appWidgetId)
        val minWidth = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
        val minHeight = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)

        val views = RemoteViews(context.packageName, R.layout.widget_fullbleed)

        // Launch coroutine to fetch artwork data
        CoroutineScope(Dispatchers.Main).launch {
            try {
                // Show loading spinner and overlay initially
                setLoadingVisibility(views, true)

                val apiClient = ArtsyApiClient.getInstance()
                val artworks = apiClient.fetchFeaturedArtworks()
                val artwork = getNextArtwork(context, appWidgetId, artworks)

                if (artwork != null) {
                    // Set up click intent to open artwork in Artsy app
                    val intent = Intent(Intent.ACTION_VIEW, artwork.url.toUri()).apply {
                        setPackage(context.packageName) // Force opening in Artsy app
                    }
                    val pendingIntent = PendingIntent.getActivity(
                        context,
                        appWidgetId,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(R.id.artwork_image, pendingIntent)

                    // Load artwork image
                    val density = context.resources.displayMetrics.density
                    val widthPx = (minWidth * density).toInt()
                    val heightPx = (minHeight * density).toInt()

                    val bitmap = apiClient.downloadArtworkImage(artwork, widthPx, heightPx)
                    if (bitmap != null) {
                        views.setImageViewBitmap(R.id.artwork_image, bitmap)
                    } else {
                        Log.e(TAG, "Failed to download artwork image")
                    }
                }

                setLoadingVisibility(views, false)
                appWidgetManager.updateAppWidget(appWidgetId, views)
            } catch (e: Exception) {
                Log.e(TAG, "Error updating widget: ${e.message ?: e.toString()}")

                setLoadingVisibility(views, false)
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }

    override fun onAppWidgetOptionsChanged(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int,
        newOptions: android.os.Bundle
    ) {
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions)
        updateWidget(context, appWidgetManager, appWidgetId)
    }

    private fun getNextArtwork(context: Context, appWidgetId: Int, artworks: List<Artwork>): Artwork? {
        if (artworks.isEmpty()) return null

        val prefs = context.getSharedPreferences("fullbleed_widget_prefs", Context.MODE_PRIVATE)
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

        // Get stored values for this widget
        val storedDate = prefs.getString("date_$appWidgetId", "")
        val currentIndex = prefs.getInt("index_$appWidgetId", 0)

        val nextIndex = if (storedDate == today) {
            // Same day: rotate to next artwork
            (currentIndex + 1) % artworks.size
        } else {
            // New day: start from first artwork
            0
        }

        // Save current state
        prefs.edit {
            putString("date_$appWidgetId", today)
            putInt("index_$appWidgetId", nextIndex)
        }

        return artworks.getOrNull(nextIndex)
    }

    private fun setLoadingVisibility(views: RemoteViews, isLoading: Boolean) {
        val visibility = if (isLoading) View.VISIBLE else View.GONE
        views.setViewVisibility(R.id.loading_spinner, visibility)
        views.setViewVisibility(R.id.loading_overlay, visibility)
    }
}