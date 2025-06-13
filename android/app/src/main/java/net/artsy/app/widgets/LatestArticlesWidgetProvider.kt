package net.artsy.app.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.text.SpannableString
import android.text.style.UnderlineSpan
import android.graphics.Paint
import android.util.Log
import android.widget.RemoteViews
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import net.artsy.app.R
import net.artsy.app.widgets.client.ArtsyApiClient

class LatestArticlesWidgetProvider : AppWidgetProvider() {

    companion object {
        private const val TAG = "LatestArticlesWidget"
        private const val WIDGET_KIND = "LatestArticlesWidget"
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
        
        // Determine widget size - medium if wide enough for 2 columns
        val isMedium = minWidth > 250
        val layoutId = if (isMedium) {
            R.layout.widget_latest_articles_medium
        } else {
            R.layout.widget_latest_articles_small
        }
        
        val views = RemoteViews(context.packageName, layoutId)
        
        // Set up logo click intent to open Artsy app
        val artsyIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.artsy.net")).apply {
            setPackage(context.packageName) // Force opening in Artsy app
        }
        val artsyPendingIntent = PendingIntent.getActivity(
            context,
            appWidgetId + 20000, // Offset to avoid conflicts
            artsyIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        views.setOnClickPendingIntent(R.id.artsy_logo, artsyPendingIntent)
        views.setOnClickPendingIntent(R.id.editorial_label, artsyPendingIntent)
        
        // Launch coroutine to fetch articles data
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val apiClient = ArtsyApiClient.getInstance()
                val articles = apiClient.fetchLatestArticles()
                
                if (articles.isNotEmpty()) {
                    if (isMedium && articles.size >= 2) {
                        // Medium widget - show two articles side by side
                        val article1 = articles[0]
                        val article2 = articles[1]
                        
                        // Set up first article
                        views.setTextViewText(R.id.article_1_title, article1.title)
                        val readMore1 = SpannableString("Read More")
                        readMore1.setSpan(UnderlineSpan(), 0, readMore1.length, 0)
                        views.setTextViewText(R.id.read_more_1, readMore1)
                        
                        val intent1 = Intent(Intent.ACTION_VIEW, Uri.parse(article1.url)).apply {
                            setPackage(context.packageName) // Try to open in Artsy app first
                        }
                        val pendingIntent1 = PendingIntent.getActivity(
                            context,
                            appWidgetId + 1,
                            intent1,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )
                        views.setOnClickPendingIntent(R.id.article_1_container, pendingIntent1)
                        
                        // Set up second article
                        views.setTextViewText(R.id.article_2_title, article2.title)
                        val readMore2 = SpannableString("Read More")
                        readMore2.setSpan(UnderlineSpan(), 0, readMore2.length, 0)
                        views.setTextViewText(R.id.read_more_2, readMore2)
                        
                        val intent2 = Intent(Intent.ACTION_VIEW, Uri.parse(article2.url)).apply {
                            setPackage(context.packageName) // Try to open in Artsy app first
                        }
                        val pendingIntent2 = PendingIntent.getActivity(
                            context,
                            appWidgetId + 2,
                            intent2,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )
                        views.setOnClickPendingIntent(R.id.article_2_container, pendingIntent2)
                        
                        Log.d(TAG, "Updated medium widget $appWidgetId with 2 articles")
                    } else {
                        // Small widget - show single article
                        val article = articles[0]
                        
                        views.setTextViewText(R.id.article_title, article.title)
                        val readMore = SpannableString("Read More")
                        readMore.setSpan(UnderlineSpan(), 0, readMore.length, 0)
                        views.setTextViewText(R.id.read_more, readMore)
                        
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(article.url)).apply {
                            setPackage(context.packageName) // Try to open in Artsy app first
                        }
                        val pendingIntent = PendingIntent.getActivity(
                            context,
                            appWidgetId,
                            intent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )
                        views.setOnClickPendingIntent(R.id.article_title, pendingIntent)
                        views.setOnClickPendingIntent(R.id.read_more, pendingIntent)
                        
                        Log.d(TAG, "Updated small widget $appWidgetId with 1 article")
                    }
                } else {
                    Log.w(TAG, "No articles found for widget $appWidgetId")
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