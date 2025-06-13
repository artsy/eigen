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

class LatestArticlesWidgetProvider : AppWidgetProvider() {

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
                    
                    // Create intent with multiple fallback options
                    val articleIntent = createArticleIntent(context, article.url)
                    val articlePendingIntent = PendingIntent.getActivity(
                        context,
                        appWidgetId,
                        articleIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(R.id.article_title, articlePendingIntent)
                    views.setOnClickPendingIntent(R.id.read_more, articlePendingIntent)
                    
                } else {
                    // No articles found - create generic editorial intent
                    views.setTextViewText(R.id.article_title, "Latest Artsy Articles")
                    views.setTextViewText(R.id.read_more, "Tap to read")
                    
                    val genericIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.artsy.net/articles")).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    val genericPendingIntent = PendingIntent.getActivity(
                        context,
                        appWidgetId,
                        genericIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(R.id.article_title, genericPendingIntent)
                    views.setOnClickPendingIntent(R.id.read_more, genericPendingIntent)
                }
                
                // Set up logo click to go to Artsy editorial
                val editorialIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.artsy.net/articles")).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
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
                
            } catch (e: Exception) {
                // Update with fallback content
                views.setTextViewText(R.id.article_title, "Latest Artsy Articles")
                views.setTextViewText(R.id.read_more, "Tap to read")
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }

    private fun createArticleIntent(context: Context, articleUrl: String): Intent {
        // Extract article ID from editorial URL to match React Native route format
        val articleId = extractArticleId(articleUrl)
        val formattedUrl = if (articleId != null) {
            "https://www.artsy.net/article/$articleId"
        } else {
            articleUrl // fallback to original URL
        }
        
        // Create an explicit intent to launch the main Artsy activity
        val appIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
            action = Intent.ACTION_VIEW
            data = Uri.parse(formattedUrl)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }
        
        // If we have the app intent, return it; otherwise return web intent
        return appIntent ?: Intent(Intent.ACTION_VIEW, Uri.parse(formattedUrl)).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
    }
    
    private fun extractArticleId(articleUrl: String): String? {
        return try {
            // Extract article ID from URLs like:
            // https://www.artsy.net/article/artsy-editorial-something -> artsy-editorial-something
            // https://www.artsy.net/article/some-article-id -> some-article-id
            val uri = Uri.parse(articleUrl)
            if (uri.host?.contains("artsy.net") == true && uri.pathSegments?.size == 2 && uri.pathSegments[0] == "article") {
                uri.pathSegments[1]
            } else {
                null
            }
        } catch (e: Exception) {
            null
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