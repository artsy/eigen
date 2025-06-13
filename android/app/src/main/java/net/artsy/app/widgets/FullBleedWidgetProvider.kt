package net.artsy.app.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.widget.RemoteViews
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import net.artsy.app.R
import net.artsy.app.widgets.client.ArtsyApiClient

class FullBleedWidgetProvider : AppWidgetProvider() {

    companion object {
        private const val TAG = "FullBleedWidget"
        private const val WIDGET_KIND = "FullBleedWidget"
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")

        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        Log.d(TAG, "Widget enabled")
        super.onEnabled(context)
    }

    override fun onDisabled(context: Context) {
        Log.d(TAG, "Widget disabled")
        super.onDisabled(context)
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        Log.d(TAG, "Updating widget $appWidgetId")

        val widgetOptions = appWidgetManager.getAppWidgetOptions(appWidgetId)
        val minWidth = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
        val minHeight = widgetOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)

        Log.d(TAG, "Widget $appWidgetId size: ${minWidth}x${minHeight}dp")

        val views = RemoteViews(context.packageName, R.layout.widget_fullbleed)

        // Launch coroutine to fetch artwork data
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val apiClient = ArtsyApiClient.getInstance()
                val artworks = apiClient.fetchFeaturedArtworks()
                val artwork = artworks.firstOrNull()

                if (artwork != null) {
                    // Set up click intent to open artwork in Artsy app
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(artwork.url)).apply {
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
                        Log.d(TAG, "Successfully loaded artwork image for widget $appWidgetId")
                    } else {
                        Log.w(TAG, "Failed to load artwork image for widget $appWidgetId")
                        // Keep default background
                    }

                    // Set up logo click intent to open Artsy app
                    val artsyIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.artsy.net")).apply {
                        setPackage(context.packageName) // Force opening in Artsy app
                    }
                    val artsyPendingIntent = PendingIntent.getActivity(
                        context,
                        appWidgetId + 10000, // Offset to avoid conflicts
                        artsyIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(R.id.artsy_logo, artsyPendingIntent)
                } else {
                    Log.w(TAG, "No artwork found for widget $appWidgetId")
                }

                // Update the widget
                appWidgetManager.updateAppWidget(appWidgetId, views)

            } catch (e: Exception) {
                Log.e(TAG, "Error updating widget $appWidgetId", e)
                // Update with default view
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
        Log.d(TAG, "Widget options changed for $appWidgetId")
        updateWidget(context, appWidgetManager, appWidgetId)
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions)
    }
}