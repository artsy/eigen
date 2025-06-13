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
        
        val views = RemoteViews(context.packageName, R.layout.widget_latest_articles_small)
        
        // Set initial content immediately
        views.setTextViewText(R.id.editorial_label, "Editorial")
        views.setTextViewText(R.id.article_title, "Loading articles...")
        views.setTextViewText(R.id.read_more, "Tap to read")
        
        // Update widget with loading state first
        appWidgetManager.updateAppWidget(appWidgetId, views)
        
        // Launch coroutine to fetch articles
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val apiClient = ArtsyApiClient.getInstance()
                val articles = apiClient.fetchLatestArticles()
                val article = articles.firstOrNull()
                
                if (article != null) {
                    // Update with article data
                    views.setTextViewText(R.id.article_title, article.title)
                    views.setTextViewText(R.id.read_more, "Read More")
                    
                    // Set up click intent to open article
                    val articleIntent = Intent(Intent.ACTION_VIEW, Uri.parse(article.url)).apply {
                        setPackage(context.packageName)
                    }
                    val articlePendingIntent = PendingIntent.getActivity(
                        context,
                        appWidgetId,
                        articleIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(R.id.article_title, articlePendingIntent)
                    views.setOnClickPendingIntent(R.id.read_more, articlePendingIntent)
                    
                } else {
                    // No articles found
                    views.setTextViewText(R.id.article_title, "Latest Artsy Articles")
                    views.setTextViewText(R.id.read_more, "Tap to read")
                }
                
                // Set up logo click to go to Artsy editorial
                val editorialIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.artsy.net/articles")).apply {
                    setPackage(context.packageName)
                }
                val editorialPendingIntent = PendingIntent.getActivity(
                    context,
                    appWidgetId + 1000,
                    editorialIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                views.setOnClickPendingIntent(R.id.artsy_logo, editorialPendingIntent)
                views.setOnClickPendingIntent(R.id.editorial_label, editorialPendingIntent)
                
                // Update widget with final content
                appWidgetManager.updateAppWidget(appWidgetId, views)
                Log.d(TAG, "Widget $appWidgetId updated with article: ${article?.title ?: "none"}")
                
            } catch (e: Exception) {
                Log.e(TAG, "Error fetching articles for widget $appWidgetId", e)
                // Update with fallback content
                views.setTextViewText(R.id.article_title, "Latest Artsy Articles")
                views.setTextViewText(R.id.read_more, "Tap to read")
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