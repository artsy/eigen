package net.artsy.app.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import net.artsy.app.R
import net.artsy.app.widgets.client.ArtsyApiClient

class FullBleedWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
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
                }

                // Update the widget
                appWidgetManager.updateAppWidget(appWidgetId, views)

            } catch (e: Exception) {
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
        updateWidget(context, appWidgetManager, appWidgetId)
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions)
    }
}